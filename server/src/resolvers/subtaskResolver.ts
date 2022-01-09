import { Subtask } from "../entities/Subtask";
import { Task } from "../entities/Task";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../utils/MyContext";
import {
  Arg,
  createUnionType,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";

@ObjectType()
class SubTaskFail {
  @Field(() => [String])
  errors: string[];
}

@ObjectType()
class ManySubtasksResponse {
  @Field(() => [Subtask])
  tasks: Subtask[];
}

const ManySubtasksUnion = createUnionType({
  name: "ManySubtaskResponse",
  types: () => [ManySubtasksResponse, SubTaskFail] as const,
  resolveType: (value) => {
    if ("errors" in value) {
      return SubTaskFail;
    } else {
      return ManySubtasksResponse;
    }
  },
});

const SingleSubtaskUnion = createUnionType({
  name: "SingleSubtaskResponse",
  types: () => [Subtask, SubTaskFail] as const,
  resolveType: (value) => {
    if ("errors" in value) {
      return SubTaskFail;
    } else {
      return Subtask;
    }
  },
});

@Resolver(Subtask)
export class subtaskResolver {
  @Query(() => ManySubtasksUnion)
  @UseMiddleware(isAuth)
  async getAllSubtasksOfTask(
    @Ctx() { payload }: MyContext,
    @Arg("id") id: string
  ): Promise<typeof ManySubtasksUnion> {
    const task = await Task.findOne(id);
    if (task?.userId === payload?.userId) {
      const tasks = await Subtask.createQueryBuilder("subtask")
        .select()
        .where("subtask.taskId = :id", { id })
        .getMany();
      return {
        tasks,
      };
    } else {
      return { errors: ["You are not authorized for this action"] };
    }
  }

  @Mutation(() => SingleSubtaskUnion)
  @UseMiddleware(isAuth)
  async createSubtask(
    @Arg("name") name: string,
    @Arg("taskId") taskId: string,
    @Ctx() { payload }: MyContext
  ): Promise<typeof SingleSubtaskUnion> {
    const task = await Task.findOne({ where: { id: taskId } });
    if (task?.userId == payload?.userId) {
      const result = await Subtask.createQueryBuilder()
        .insert()
        .values({ name, taskId })
        .returning("*")
        .execute();

      return result.raw[0];
    }
    return { errors: ["Your are not authorized for this action"] };
  }

  @Mutation(() => SingleSubtaskUnion)
  @UseMiddleware(isAuth)
  async toggleTask(
    @Ctx() { payload }: MyContext,
    @Arg("id") id: string
  ): Promise<typeof SingleSubtaskUnion> {
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
    return {
      errors: ["Your are not authorized for this action"],
    };
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
      return false;
    }
    return false;
  }
}
