import { Task } from "../entities/Task";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../utils/MyContext";
import {
  Arg,
  createUnionType,
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
import { Subject } from "../entities/Subject";
import DataLoader from "dataloader";

const subjectLoader = new DataLoader((keys) => loadSubjects(keys as [string]), {
  cache: false,
});
// loading subjects for all tasks at once
const loadSubjects = async (keys: [string]) => {
  const result = await Subject.createQueryBuilder("subject")
    .select()
    .where("subject.id IN (:...ids)", { ids: keys })
    .getMany();
  // mapping loaded subjects to task ids
  return keys.map((key) => result.find((subject) => subject.id === key));
};

const subtaskLoader = new DataLoader((keys) => loadSubtasks(keys as [string]), {
  cache: false,
});

// loading subtasks for all tasks at once
const loadSubtasks = async (keys: [string]) => {
  const result = await Subtask.createQueryBuilder("subtask")
    .select()
    .where("subtask.taskId IN (:...ids)", { ids: keys })
    .getMany();
  // mapping loaded subtasks to task ids
  return keys.map((key) => result.filter((subtask) => subtask.taskId === key));
};

@ObjectType()
export class TaskFail {
  @Field(() => [String])
  errors: string[];
}

const TaskUnion = createUnionType({
  name: "TaskResponse",
  types: () => [Task, TaskFail] as const,
  resolveType: (value) => {
    if ("errors" in value) {
      return TaskFail;
    } else {
      return Task;
    }
  },
});

@Resolver(Task)
export class taskResolver {
  // !!!! Delete this !!!!
  @Query(() => [Task])
  getAllTasks() {
    return Task.find();
  }

  @FieldResolver()
  async subtasks(@Root() root: Task) {
    return subtaskLoader.load(root.id);
  }

  @FieldResolver()
  async subject(@Root() root: Task) {
    return subjectLoader.load(root.subjectId);
  }

  @Mutation(() => Task)
  @UseMiddleware(isAuth)
  async createTask(
    @Arg("name") name: string,
    @Arg("subjectId", { nullable: true }) subjectId: string,
    @Ctx() { payload }: MyContext
  ) {
    const result = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Task)
      .values({ name, userId: payload?.userId, subjectId })
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
    // check if tasks user is the same as currenct user
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

  @Mutation(() => TaskUnion)
  @UseMiddleware(isAuth)
  async toggleTask(
    @Ctx() { payload }: MyContext,
    @Arg("id") id: string
  ): Promise<typeof TaskUnion> {
    const task = await Task.findOne(id);
    // check if tasks user is the same as currenct user and task exists
    if (task?.userId === payload?.userId && task) {
      const newValue = !task.done;
      const updateResult = await Task.createQueryBuilder()
        .update()
        .set({ done: newValue })
        .where("id = :id", { id })
        .returning("*")
        .execute();
      return updateResult.raw[0];
    } else {
      return {
        errors: ["something went wrong"],
      };
    }
  }
}
