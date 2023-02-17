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
import { queueMiddleware } from "../middleware/queueMiddleware";

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
  @UseMiddleware(queueMiddleware)
  async createLesson(
    @Ctx() { payload }: MyContext,
    @Arg("id") id: string,
    @Arg("subjectId") subjectId: string,
    @Arg("lessonTimeId") lessonTimeId: string,
    @Arg("dayOfTheWeek") dayOfTheWeek: string
  ) {
    const lesson = await Lesson.create({
      id,
      subjectId,
      lessonTimeId,
      dayOfTheWeek: dayOfTheWeek as WEEK_DAYS,
      userId: payload?.userId,
    }).save();
    const lessonWithRelations = await Lesson.findOne({
      where: { id: lesson.id },
      relations: { subject: true, lessonTime: true },
    });
    return lessonWithRelations;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  @UseMiddleware(queueMiddleware)
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

  @Mutation(() => Lesson)
  @UseMiddleware(isAuth)
  @UseMiddleware(queueMiddleware)
  async editLesson(
    @Arg("subjectId") subjectId: string,
    @Arg("id") id: string,
    @Ctx() { payload }: MyContext
  ) {
    await Lesson.update({ id, userId: payload?.userId }, { subjectId });
    const lesson = Lesson.findOne({
      where: { id, userId: payload?.userId },
      relations: { subject: true, lessonTime: true },
    });
    return lesson;
  }
}
