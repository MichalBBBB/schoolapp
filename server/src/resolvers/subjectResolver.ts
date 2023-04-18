import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../utils/MyContext";
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { Subject } from "../entities/Subject";
import { queueMiddleware } from "../middleware/queueMiddleware";

@Resolver(Subject)
export class subjectResolver {
  @Query(() => [Subject])
  @UseMiddleware(isAuth)
  getAllSubjects(@Ctx() { payload }: MyContext) {
    return Subject.createQueryBuilder("subject")
      .select()
      .where("subject.userId = :id", { id: payload?.userId })
      .getMany();
  }

  @Mutation(() => Subject)
  @UseMiddleware(isAuth)
  @UseMiddleware(queueMiddleware)
  async createSubject(
    @Arg("id") id: string,
    @Arg("name") name: string,
    @Arg("colorName") colorName: string,
    @Ctx() { payload }: MyContext,
    @Arg("extraInfo", { nullable: true }) extraInfo?: string
  ) {
    const result = await Subject.createQueryBuilder("subject")
      .insert()
      .values({ id, name, userId: payload?.userId, colorName, extraInfo })
      .returning("*")
      .execute();
    return result.raw[0];
  }

  @Mutation(() => Subject)
  @UseMiddleware(isAuth)
  @UseMiddleware(queueMiddleware)
  async editSubject(
    @Ctx() { payload }: MyContext,
    @Arg("id") id: string,
    @Arg("name") name: string,
    @Arg("colorName") colorName: string,
    @Arg("extraInfo", { nullable: true }) extraInfo?: string
  ) {
    const subject = await Subject.findOne({ where: { id } });
    if (subject && subject.userId == payload?.userId) {
      subject.name = name;
      subject.colorName = colorName;
      subject.extraInfo = extraInfo;
      await subject.save();
      return subject;
    } else {
      throw new Error("you are not authorized for this action");
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  @UseMiddleware(queueMiddleware)
  async deleteSubject(@Arg("id") id: string, @Ctx() { payload }: MyContext) {
    const subject = await Subject.findOne({ where: { id } });
    if (subject && subject?.userId == payload?.userId) {
      subject.remove();
      return true;
    } else {
      return false;
    }
  }
}
