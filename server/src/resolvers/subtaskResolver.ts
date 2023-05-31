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
import { queueMiddleware } from "../middleware/queueMiddleware";

@Resolver(Subtask)
export class subtaskResolver {
  @Query(() => [Subtask])
  @UseMiddleware(isAuth)
  async getAllSubtasksOfTask(
    @Ctx() { payload }: MyContext,
    @Arg("id") id: string
  ): Promise<Subtask[]> {
    const task = await Task.findOne({ where: { id } });
    //check if tasks user is same as current user
    if (task?.userId === payload?.userId) {
      const tasks = await Subtask.createQueryBuilder("subtask")
        .select()
        .where("subtask.taskId = :id", { id })
        .getMany();
      return tasks;
    } else {
      throw new Error("you are not authorized for this action");
    }
  }

  @Mutation(() => Subtask)
  @UseMiddleware(isAuth)
  @UseMiddleware(queueMiddleware)
  async createSubtask(
    @Arg("id") id: string,
    @Arg("name") name: string,
    @Arg("taskId") taskId: string,
    @Ctx() { payload }: MyContext
  ): Promise<Subtask> {
    const task = await Task.findOne({ where: { id: taskId } });
    // check if tasks user is same as current user
    if (task?.userId == payload?.userId) {
      const result = await Subtask.createQueryBuilder()
        .insert()
        .values({ id, name, taskId })
        .returning("*")
        .execute();

      return result.raw[0];
    }
    throw new Error("you are not authorized for this action");
  }

  @Mutation(() => Subtask)
  @UseMiddleware(isAuth)
  @UseMiddleware(queueMiddleware)
  async toggleSubtask(
    @Ctx() { payload }: MyContext,
    @Arg("id") id: string
  ): Promise<Subtask> {
    const subtask = await Subtask.findOne({ where: { id } });
    if (subtask) {
      const task = await Task.findOne({ where: { id: subtask.taskId } });

      if (task?.userId === payload?.userId && task) {
        const newValue = !subtask.done;
        const updateResult = await Subtask.createQueryBuilder()
          .update()
          .set({ done: newValue })
          .where("id = :id", { id })
          .returning("*")
          .execute();
        return updateResult.raw[0];
      }
      throw new Error("you are not authorized for this action");
    }
    throw new Error("subtask doesn't exist");
  }

  @Mutation(() => Subtask)
  @UseMiddleware(isAuth)
  @UseMiddleware(queueMiddleware)
  async editSubtask(
    @Arg("id") id: string,
    @Arg("name") name: string,
    @Ctx() { payload }: MyContext
  ) {
    const subtask = await Subtask.findOne({ where: { id } });
    if (subtask) {
      const task = await Task.findOne({ where: { id: subtask.taskId } });

      if (task?.userId === payload?.userId && task) {
        await Subtask.update({ id }, { name });
        return Subtask.findOne({ where: { id } });
      }
      throw new Error("you are not authorized for this action");
    }
    throw new Error("subtask doesn't exist");
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  @UseMiddleware(queueMiddleware)
  async deleteSubtask(@Ctx() { payload }: MyContext, @Arg("id") id: string) {
    const subtask = await Subtask.findOne({ where: { id } });
    if (subtask) {
      const task = await Task.findOne({ where: { id: subtask.taskId } });
      // check if task exists and tasks user is same as current user
      if (task && task.userId == payload?.userId) {
        Subtask.createQueryBuilder("subtask")
          .delete()
          .where("subtask.id = :id", { id })
          .execute();
        return true;
      }
      return false;
    }
    return false;
  }
}
