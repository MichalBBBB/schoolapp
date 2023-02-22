import { Ctx, Query, Resolver, UseMiddleware } from "type-graphql";
import { Reminder } from "../entities/Reminder";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../utils/MyContext";

@Resolver(Reminder)
export class reminderResolver {
  @Query(() => [Reminder])
  @UseMiddleware(isAuth)
  async getAllReminders(@Ctx() { payload }: MyContext) {
    return Reminder.find({ where: { userId: payload?.userId } });
  }
}
