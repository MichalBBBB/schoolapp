import { CalendarEvent } from "../entities/CalendarEvent";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../utils/MyContext";
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";

@Resolver(() => CalendarEvent)
export class calendarEventResolver {
  @Query(() => [CalendarEvent])
  @UseMiddleware(isAuth)
  getAllEvents(@Ctx() { payload }: MyContext) {
    return CalendarEvent.find({
      where: { userId: payload?.userId },
      relations: { subject: true },
    });
  }

  @Mutation(() => CalendarEvent)
  @UseMiddleware(isAuth)
  async createEvent(
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
