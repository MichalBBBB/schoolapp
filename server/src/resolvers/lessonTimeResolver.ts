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

@InputType()
class LessonTimeInput implements Partial<LessonTime> {
  @Field()
  startTime: Date;

  @Field()
  endTime: Date;
}

@Resolver(LessonTime)
export class lessonTimeResolver {
  @Query(() => [LessonTime])
  @UseMiddleware(isAuth)
  getAllLessonTimes(@Ctx() { payload }: MyContext) {
    return LessonTime.createQueryBuilder("lessontime")
      .select()
      .where("lessontime.userId == :id", { id: payload?.userId })
      .getMany();
  }

  @Mutation(() => [LessonTime])
  @UseMiddleware(isAuth)
  async createLessonTimes(
    @Ctx() { payload }: MyContext,
    @Arg("lessonTimes", () => [LessonTimeInput]) lessonTimes: LessonTimeInput[]
  ) {
    const lessonTimesWithUser = lessonTimes.map((item) => {
      return { ...item, userId: payload?.userId };
    });
    const result = await LessonTime.createQueryBuilder()
      .insert()
      .values(lessonTimesWithUser)
      .returning("*")
      .execute();
    return result.raw;
  }
}
