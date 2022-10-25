import { LessonTime } from "../entities/LessonTime";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../utils/MyContext";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { AppDataSource } from "../TypeORM";

@InputType()
class LessonTimeInput implements Partial<LessonTime> {
  @Field()
  id: string;

  @Field()
  startTime: string;

  @Field()
  endTime: string;
}

@Resolver(LessonTime)
export class lessonTimeResolver {
  @Query(() => [LessonTime])
  @UseMiddleware(isAuth)
  async getAllLessonTimes(@Ctx() { payload }: MyContext) {
    console.log(payload);
    const result = await LessonTime.createQueryBuilder("lessontime")
      .select()
      .where('lessontime."userId" = :id', { id: payload?.userId })
      .orderBy('"startTime"')
      .getMany();
    return result;
  }

  @Mutation(() => LessonTime)
  @UseMiddleware(isAuth)
  async createLessonTime(
    @Arg("startTime") startTime: string,
    @Arg("endTime") endTime: string,
    @Ctx() { payload }: MyContext
  ) {
    const lessonTime = await LessonTime.create({
      startTime,
      endTime,
      userId: payload?.userId,
    }).save();
    return lessonTime;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteLessonTimes(
    @Ctx() { payload }: MyContext,
    @Arg("ids", () => [String]) ids: string[]
  ) {
    await LessonTime.createQueryBuilder("lessonTime")
      .delete()
      .where("id in :ids", { ids })
      .andWhere("userId = :userid", { userid: payload?.userId })
      .execute();
    return true;
  }

  @Mutation(() => LessonTime)
  @UseMiddleware(isAuth)
  async editLessonTime(
    @Arg("id") id: string,
    @Arg("startTime") startTime: string,
    @Arg("endTime") endTime: string,
    @Ctx() { payload }: MyContext
  ) {
    const lessonTime = await LessonTime.findOne({
      where: { id, userId: payload?.userId },
    });
    if (lessonTime) {
      lessonTime.startTime = startTime;
      lessonTime.endTime = endTime;
      await lessonTime.save();
      return lessonTime;
    } else {
      throw new Error("LessonTime wasn't found");
    }
  }

  @Mutation(() => [LessonTime])
  @UseMiddleware(isAuth)
  async editLessonTimes(
    @Arg("lessonTimes", () => [LessonTimeInput]) lessonTimes: LessonTimeInput[],
    @Ctx() { payload }: MyContext
  ) {
    console.log("here");
    await AppDataSource.transaction(async (transactionEntityManager) => {
      lessonTimes.forEach((item) => {
        transactionEntityManager.update(
          LessonTime,
          { id: item.id, userId: payload?.userId },
          { startTime: item.startTime, endTime: item.endTime }
        );
      });
    });
    return LessonTime.find({ where: { userId: payload?.userId } });
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteLessonTime(@Arg("id") id: string, @Ctx() { payload }: MyContext) {
    await LessonTime.createQueryBuilder("lessonTime")
      .delete()
      .where("id = :id", { id })
      .andWhere("userId = :userid", { userid: payload?.userId })
      .execute();
    return true;
  }
}