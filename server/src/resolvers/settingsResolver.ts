import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { Settings } from "../entities/Settings";
import { User } from "../entities/User";
import { isAuth } from "../middleware/isAuth";
import { queueMiddleware } from "../middleware/queueMiddleware";
import { MyContext } from "../utils/MyContext";

@Resolver()
export class settingsResolver {
  @Mutation(() => Settings)
  @UseMiddleware(isAuth)
  @UseMiddleware(queueMiddleware)
  async setSettings(
    @Ctx() { payload }: MyContext,
    @Arg("startOfWeek", { nullable: true }) startOfWeek?: "MON" | "SAT" | "SUN"
  ) {
    const user = await User.findOne({ where: { id: payload?.userId } });
    await Settings.update({ id: user?.settingsId }, { startOfWeek });
    return Settings.findOne({ where: { id: user?.settingsId } });
  }
}
