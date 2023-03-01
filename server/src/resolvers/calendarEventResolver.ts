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
    @Arg("subjectId", { nullable: true }) subjectId?: string
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
      })
      .returning("*")
      .execute();
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
    @Arg("subjectId", { nullable: true }) subjectId: string
  ) {
    const event = await CalendarEvent.findOne({ where: { id } });
    if (event?.userId === payload?.userId && event) {
      event.startDate = startDate;
      event.endDate = endDate;
      event.wholeDay = wholeDay;
      event.subjectId = subjectId;
      event.save();
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
