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
import { Subject } from "../entities/Subject";
import DataLoader from "dataloader";

const subjectLoader = new DataLoader((keys) => loadSubjects(keys as [string]), {
  cache: false,
});

const loadSubjects = async (keys: [string]) => {
  const result = await Subject.createQueryBuilder("subject")
    .select()
    .where("subject.id IN (:...ids)", { ids: keys })
    .getMany();
  return keys.map((key) => result.find((subject) => subject.id === key));
};

const subtaskLoader = new DataLoader((keys) => loadSubtasks(keys as [string]), {
  cache: false,
});

const loadSubtasks = async (keys: [string]) => {
  const result = await Subtask.createQueryBuilder("subtask")
    .select()
    .where("subtask.taskId IN (:...ids)", { ids: keys })
    .getMany();
  return keys.map((key) => result.filter((subtask) => subtask.taskId === key));
};

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
