import DataLoader from "dataloader";
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
import { LessonTime } from "../entities/LessonTime";
import { Schedule } from "../entities/Schedule";
import { isAuth } from "../middleware/isAuth";
import { queueMiddleware } from "../middleware/queueMiddleware";
import { MyContext } from "../utils/MyContext";

const lessonTimeLoader = new DataLoader(
  (keys) => loadLessonTimes(keys as [string]),
  {
    cache: false,
  }
);
// loading lessonTimes for all schedules at once
const loadLessonTimes = async (keys: [string]) => {
  const result = await LessonTime.createQueryBuilder("lessontime")
    .select()
    .where("lessontime.scheduleId IN (:...ids)", { ids: keys })
    .getMany();
  // mapping loaded subjects to task ids
  return keys.map((key) =>
    result.filter((lessonTime) => lessonTime.scheduleId === key)
  );
};

@Resolver(Schedule)
export class ScheduleResolver {
  // !!!! Delete !!!!
  @Query(() => [Schedule])
  getSchedules() {
    return Schedule.find();
  }

  @FieldResolver(() => [LessonTime])
  async lessonTimes(@Root() schedule: Schedule) {
    const result = await lessonTimeLoader.load(schedule.id);
    return result || [];
  }

  @Query(() => [Schedule])
  @UseMiddleware(isAuth)
  async getAllSchedules(@Ctx() { payload }: MyContext) {
    return Schedule.find({ where: { userId: payload?.userId } });
  }

  @Mutation(() => Schedule)
  @UseMiddleware(isAuth)
  @UseMiddleware(queueMiddleware)
  async createSchedule(
    @Arg("name") name: string,
    @Arg("id") id: string,
    @Ctx() { payload }: MyContext
  ) {
    const schedule = await Schedule.create({
      id,
      name,
      userId: payload?.userId,
    }).save();
    return schedule;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  @UseMiddleware(queueMiddleware)
  async deleteSchedule(@Arg("id") id: string, @Ctx() { payload }: MyContext) {
    const schedule = await Schedule.findOne({ where: { id } });
    if (schedule && schedule.userId == payload?.userId) {
      await schedule.remove();
      return true;
    } else {
      throw new Error("Shedule wasn't found");
    }
  }

  @Mutation(() => Schedule)
  @UseMiddleware(isAuth)
  @UseMiddleware(queueMiddleware)
  async editSchedule(
    @Arg("id") id: string,
    @Arg("name") name: string,
    @Ctx() { payload }: MyContext
  ) {
    const schedule = await Schedule.findOne({ where: { id } });
    if (schedule && schedule.userId == payload?.userId) {
      schedule.name = name;
      await schedule.save();
      return schedule;
    } else {
      throw new Error("Schedule wasn't found");
    }
  }
}
