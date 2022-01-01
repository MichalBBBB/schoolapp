import { Task } from "../entities/Task";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../utils/MyContext";
import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { getConnection } from "typeorm";
import { Subtask } from "../entities/Subtask";

@ObjectType()
class SignleTaskResponse {
  @Field(() => Task, { nullable: true })
  task?: Task;

  @Field(() => String, { nullable: true })
  errors?: String[];
}

@Resolver(Task)
export class taskResolver {
  // !!!! Delete this !!!!
  @Query(() => [Task])
  getAllTasks() {
    return Task.find();
  }

  @FieldResolver()
  async subtasks(@Root() root: Task) {
    const result = await Subtask.createQueryBuilder("subtask")
      .select()
      .where("subtask.taskId = :taskId", { taskId: root.id })
      .getMany();
    console.log(result);
    return result;
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

  @Mutation(() => SignleTaskResponse)
  @UseMiddleware(isAuth)
  async toggleTask(
    @Ctx() { payload }: MyContext,
    @Arg("id") id: string
  ): Promise<SignleTaskResponse> {
    const task = await Task.findOne(id);
    if (task?.userId === payload?.userId && task) {
      const newValue = !task.done;
      const updateResult = await Task.createQueryBuilder()
        .update()
        .set({ done: newValue })
        .where("id = :id", { id })
        .returning("*")
        .execute();
      return {
        task: updateResult.raw[0],
      };
    } else {
      return {
        errors: ["something went wrong"],
      };
    }
  }
}
