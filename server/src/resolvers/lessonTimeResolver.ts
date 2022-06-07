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
  @Field({ nullable: true })
  id?: string;

  @Field()
  startTime: string;

  @Field()
  endTime: string;

  @Field()
  lessonNumber: number;
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
      .getMany();
    console.log(result);
    return result;
  }

  @Mutation(() => [LessonTime])
  @UseMiddleware(isAuth)
  async createLessonTimes(
    @Ctx() { payload }: MyContext,
    @Arg("lessonTimes", () => [LessonTimeInput]) lessonTimes: LessonTimeInput[]
  ) {
    console.log("mutation");
    const lessonTimesWithUser = lessonTimes.map((item) => {
      return { ...item, userId: payload?.userId };
    });
    await LessonTime.createQueryBuilder()
      .delete()
      .where("userId = :id", { id: payload?.userId })
      .execute();
    const result = await LessonTime.createQueryBuilder()
      .insert()
      .values(lessonTimesWithUser)
      .returning("*")
      .execute();
    console.log(await LessonTime.find());
    return result.raw;
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
      .execute();
    console.log(LessonTime.find());
  }
}
