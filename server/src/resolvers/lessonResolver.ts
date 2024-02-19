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
    @Arg("dayNumber", { nullable: true }) dayNumber?: number,
    @Arg("date", { nullable: true }) date?: Date
  ) {
    if (!date && (dayNumber == null || dayNumber == undefined)) {
      throw new Error("You have to provide dayNumber of date");
    }
    const lesson = await Lesson.create({
      id,
      subjectId,
      lessonTimeId,
      dayNumber,
      date,
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
    @Ctx() { payload }: MyContext,
    @Arg("extraInfo", { nullable: true }) extraInfo?: string
  ) {
    await Lesson.update(
      { id, userId: payload?.userId },
      { subjectId, extraInfo }
    );
    const lesson = Lesson.findOne({
      where: { id, userId: payload?.userId },
      relations: { subject: true, lessonTime: true },
    });
    return lesson;
  }
}
