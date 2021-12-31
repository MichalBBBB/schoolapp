import { Task } from "../entities/Task";
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
import { getConnection } from "typeorm";

@Resolver(Task)
export class taskResolver {
  // !!!! Delete this !!!!
  @Query(() => [Task])
  getAllTasks() {
    return Task.find();
  }

  @Mutation(() => Task)
  @UseMiddleware(isAuth)
  async createTask(@Arg("name") name: string, @Ctx() { payload }: MyContext) {
    const result = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Task)
      .values({ name, userId: payload?.userId })
      .returning("*")
      .execute();
    return result.raw[0];
  }

  @Query(() => [Task])
  @UseMiddleware(isAuth)
  getTasksOfUser(@Ctx() { payload }: MyContext) {
    return Task.createQueryBuilder("task")
      .select()
      .where("task.userId = :userId", { userId: payload?.userId })
      .getMany();
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteTask(@Ctx() { payload }: MyContext, @Arg("id") id: string) {
    const task = await Task.findOne(id);
    if (task?.userId == payload?.userId) {
      Task.createQueryBuilder()
        .delete()
        .where("id = :id", { id })
        .execute()
        .catch((_err) => {
          return false;
        });
    } else {
      return false;
    }

    return true;
  }
}
