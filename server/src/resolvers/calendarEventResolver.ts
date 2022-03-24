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
    return CalendarEvent.createQueryBuilder("calendarevent")
      .select()
      .where('calendarEvent."userId" = :id', { id: payload?.userId })
      .getMany();
  }

  @Mutation(() => CalendarEvent)
  @UseMiddleware(isAuth)
  async createEvent(
    @Arg("startDate") startDate: Date,
    @Arg("endDate", { nullable: true }) endDate: Date,
    @Arg("wholeDay", { nullable: true }) wholeDay: Boolean,
    @Arg("name") name: String,
    @Ctx() { payload }: MyContext
  ) {
    const result = await CalendarEvent.createQueryBuilder("calendarEvent")
      .insert()
      .values({ startDate, endDate, wholeDay, name, userId: payload?.userId })
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
    @Arg("id") id: String,
    @Arg("subjectId", { nullable: true }) subjectId: String
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
}
