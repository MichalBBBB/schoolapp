import { LessonTime } from "../entities/LessonTime";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../utils/MyContext";
import {
  Arg,
  Args,
  ArgsType,
  Ctx,
  Field,
  InputType,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { AppDataSource } from "../TypeORM";
import { queueMiddleware } from "../middleware/queueMiddleware";
import { ErrorInterceptor } from "../middleware/errorInterceptor";
import { ValidateNested } from "class-validator";

@InputType()
class LessonTimeInput {
  @Field()
  id: string;

  @Field()
  startTime: string;

  @Field()
  endTime: string;
}

@ArgsType()
class EditLessonTimesArgs {
  @Field(() => [LessonTimeInput])
  @ValidateNested({ each: true })
  lessonTimes: LessonTimeInput[];
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
  @UseMiddleware(queueMiddleware)
  async createLessonTime(
    @Arg("id") id: string,
    @Arg("startTime") startTime: string,
    @Arg("endTime") endTime: string,
    @Ctx() { payload }: MyContext
  ) {
    const lessonTime = await LessonTime.create({
      id,
      startTime,
      endTime,
      userId: payload?.userId,
    }).save();
    return lessonTime;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  @UseMiddleware(queueMiddleware)
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

  @Mutation(() => [LessonTime])
  @UseMiddleware(isAuth)
  @UseMiddleware(queueMiddleware)
  @UseMiddleware(ErrorInterceptor)
  async editLessonTimes(
    @Args() { lessonTimes }: EditLessonTimesArgs,
    @Ctx() { payload }: MyContext
  ) {
    await AppDataSource.transaction(async (transactionEntityManager) => {
      for (const item of lessonTimes) {
        transactionEntityManager.update(
          LessonTime,
          { id: item.id, userId: payload?.userId },
          { startTime: item.startTime, endTime: item.endTime }
        );
      }
    });
    return LessonTime.find({ where: { userId: payload?.userId } });
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  @UseMiddleware(queueMiddleware)
  async deleteLessonTime(@Arg("id") id: string, @Ctx() { payload }: MyContext) {
    await LessonTime.createQueryBuilder("lessonTime")
      .delete()
      .where("id = :id", { id })
      .andWhere("userId = :userid", { userid: payload?.userId })
      .execute();
    return true;
  }
}
