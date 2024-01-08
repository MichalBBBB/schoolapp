import { CalendarEvent } from "../entities/CalendarEvent";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../utils/MyContext";
import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { queueMiddleware } from "../middleware/queueMiddleware";
import DataLoader from "dataloader";
import { Subject } from "../entities/Subject";
import { RemindersInput } from "./taskResolver";
import { AppDataSource } from "../TypeORM";
import { Reminder } from "../entities/Reminder";

const subjectLoader = new DataLoader((keys) => loadSubjects(keys as [string]), {
  cache: false,
});
// loading subjects for all tasks at once
const loadSubjects = async (keys: [string]) => {
  const result = await Subject.createQueryBuilder("subject")
    .select()
    .where("subject.id IN (:...ids)", { ids: keys })
    .getMany();
  // mapping loaded subjects to task ids
  return keys.map((key) => result.find((subject) => subject.id === key));
};

const remindersLoader = new DataLoader(
  (keys) => loadReminders(keys as [string]),
  {
    cache: false,
  }
);

const loadReminders = async (keys: [string]) => {
  const result = await Reminder.createQueryBuilder("reminder")
    .select()
    .where("reminder.eventId IN (:...ids)", { ids: keys })
    .getMany();
  return keys.map((key) =>
    result.filter((reminder) => reminder.eventId === key)
  );
};

@Resolver(() => CalendarEvent)
export class calendarEventResolver {
  @FieldResolver()
  async subject(@Root() root: CalendarEvent) {
    if (root.subjectId) {
      return subjectLoader.load(root.subjectId);
    } else {
      return null;
    }
  }

  @FieldResolver()
  async reminders(@Root() root: CalendarEvent) {
    return remindersLoader.load(root.id);
  }

  @Query(() => [CalendarEvent])
  @UseMiddleware(isAuth)
  getAllEvents(@Ctx() { payload }: MyContext) {
    return CalendarEvent.find({
      where: { userId: payload?.userId },
    });
  }

  @Mutation(() => CalendarEvent)
  @UseMiddleware(isAuth)
  @UseMiddleware(queueMiddleware)
  async createEvent(
    @Arg("id") id: string,
    @Arg("startDate") startDate: Date,
    @Arg("endDate", { nullable: true }) endDate: Date,
    @Arg("wholeDay", { nullable: true }) wholeDay: Boolean,
    @Arg("name") name: string,
    @Ctx() { payload }: MyContext,
    @Arg("subjectId", { nullable: true }) subjectId?: string,
    @Arg("reminders", () => [RemindersInput], { nullable: true })
    reminders?: RemindersInput[],
    @Arg("text", { nullable: true }) text?: string
  ) {
    const result = await CalendarEvent.createQueryBuilder("calendarEvent")
      .insert()
      .values({
        id,
        startDate,
        endDate,
        wholeDay,
        name,
        userId: payload?.userId,
        subjectId,
        text,
      })
      .returning("*")
      .execute();

    if (reminders) {
      await AppDataSource.transaction(async (transactionEntityManager) => {
        for (const item of reminders) {
          await transactionEntityManager.insert(Reminder, {
            id: item.id,
            minutesBefore: item.minutesBefore,
            title: item.title,
            body: item.body,
            eventId: id,
            userId: payload?.userId,
            date: item.date,
          });
        }
      });
    }
    return result.raw[0];
  }

  @Mutation(() => CalendarEvent)
  @UseMiddleware(isAuth)
  @UseMiddleware(queueMiddleware)
  async editEvent(
    @Ctx() { payload }: MyContext,
    @Arg("startDate") startDate: Date,
    @Arg("endDate", { nullable: true }) endDate: Date,
    @Arg("wholeDay", { nullable: true }) wholeDay: Boolean,
    @Arg("id") id: string,
    @Arg("name") name: string,
    @Arg("subjectId", { nullable: true }) subjectId: string,
    @Arg("reminders", () => [RemindersInput], { nullable: true })
    reminders?: RemindersInput[],
    @Arg("text", { nullable: true }) text?: string
  ) {
    const event = await CalendarEvent.findOne({ where: { id } });
    if (event?.userId === payload?.userId && event) {
      if (reminders) {
        await AppDataSource.transaction(async (transactionEntityManager) => {
          await transactionEntityManager.delete(Reminder, { eventId: id });
          for (const item of reminders) {
            await transactionEntityManager.insert(Reminder, {
              id: item.id,
              minutesBefore: item.minutesBefore,
              title: item.title,
              body: item.body,
              eventId: id,
              userId: payload?.userId,
              date: item.date,
            });
          }
        });
      }
      event.startDate = startDate;
      event.endDate = endDate;
      event.wholeDay = wholeDay;
      event.subjectId = subjectId;
      event.text = text;
      event.name = name;
      await event.save();
      return event;
    } else {
      throw new Error("You are not authorized or this event doesn't exist");
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  @UseMiddleware(queueMiddleware)
  async deleteEvent(@Arg("id") id: string, @Ctx() { payload }: MyContext) {
    const calendarEvent = await CalendarEvent.findOne({ where: { id } });
    // check if tasks user is the same as currenct user
    if (calendarEvent?.userId == payload?.userId) {
      CalendarEvent.createQueryBuilder()
        .delete()
        .where("id = :id", { id })
        .execute()
        .catch((_err) => {
          return false;
        });
    } else {
      return false;
    }
    return true;
  }
}
