import { Subtask } from "../entities/Subtask";
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

@Resolver(Subtask)
export class subtaskResolver {
  @Query(() => [Subtask])
  @UseMiddleware(isAuth)
  async getAllSubtasksOfTask(
    @Ctx() { payload }: MyContext,
    @Arg("id") id: string
  ) {
    const task = await Task.findOne(id);
    if (task?.userId === payload?.userId) {
      return Subtask.createQueryBuilder("subtask")
        .select()
        .where("subtask.taskId = :id", { id })
        .getMany();
    }
    throw new Error("you don't have permission for this action");
  }

  @Mutation(() => Subtask)
  @UseMiddleware(isAuth)
  async createSubtask(
    @Arg("name") name: string,
    @Arg("taskId") taskId: string,
    @Ctx() { payload }: MyContext
  ): Promise<Subtask> {
    const task = await Task.findOne({ where: { id: taskId } });
    if (task?.userId == payload?.userId) {
      const result = await Subtask.createQueryBuilder()
        .insert()
        .values({ name, taskId })
        .returning("*")
        .execute();

      return result.raw[0];
    }
    throw new Error("you don't have permission for this action");
  }

  @Mutation(() => Subtask)
  @UseMiddleware(isAuth)
  async toggleTask(
    @Ctx() { payload }: MyContext,
    @Arg("id") id: string
  ): Promise<Subtask> {
    const task = await Task.findOne(id);
    if (task?.userId === payload?.userId && task) {
      const newValue = !task.done;
      const updateResult = await Task.createQueryBuilder()
        .update()
        .set({ done: newValue })
        .where("id = :id", { id })
        .returning("*")
        .execute();
      return updateResult.raw[0];
    }
    throw new Error("you don't have permission for this action");
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteSubtask(@Ctx() { payload }: MyContext, @Arg("id") id: string) {
    const subtask = await Subtask.findOne(id);
    if (subtask) {
      const task = await Task.findOne(subtask.taskId);
      if (task && task.userId == payload?.userId) {
        Subtask.createQueryBuilder("subtask")
          .delete()
          .where("subtask.id = :id", { id });
        return true;
      }
      throw new Error("you don't have permission for this action");
    }
    throw new Error("this subtask does not exist");
  }
}
