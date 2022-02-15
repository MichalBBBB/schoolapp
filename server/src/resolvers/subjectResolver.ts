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
  async createSubject(
    @Arg("name") name: string,
    @Ctx() { payload }: MyContext
  ) {
    const result = await Subject.createQueryBuilder("subject")
      .insert()
      .values({ name, userId: payload?.userId })
      .returning("*")
      .execute();
    return result.raw[0];
  }
}
