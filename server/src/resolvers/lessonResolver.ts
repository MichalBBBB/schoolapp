import { Lesson } from "../entities/Lesson";
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../utils/MyContext";
import { WEEK_DAYS } from "../types/weekDays";

@Resolver(() => Lesson)
export class lessonResolver {
  @Query(() => [Lesson])
  @UseMiddleware(isAuth)
  getAllLessons(@Ctx() { payload }: MyContext) {
    return Lesson.find({
      where: { userId: payload?.userId },
      relations: { subject: true, lessonTime: true },
    });
  }

  @Mutation(() => Lesson)
  @UseMiddleware(isAuth)
  async createLesson(
    @Ctx() { payload }: MyContext,
    @Arg("subjectId") subjectId: string,
    @Arg("lessonTimeId") lessonTimeId: string,
    @Arg("dayOfTheWeek") dayOfTheWeek: string
  ) {
    const lesson = await Lesson.create({
      subjectId,
      lessonTimeId,
      dayOfTheWeek: dayOfTheWeek as WEEK_DAYS,
      userId: payload?.userId,
    }).save();
    const lessonWithRelations = await Lesson.findOne({
      where: { id: lesson.id },
      relations: { subject: true, lessonTime: true },
    });
    console.log(lessonWithRelations);
    return lessonWithRelations;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteLesson(@Arg("id") id: string, @Ctx() { payload }: MyContext) {
    const lesson = await Lesson.findOne({
      where: { userId: payload?.userId, id },
    });
    if (lesson) {
      await lesson.remove();
      return true;
    } else {
      throw new Error("lesson wasn't found");
    }
  }
}
