import { Task } from "../entities/Task";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../utils/MyContext";
import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { Subtask } from "../entities/Subtask";
import { Subject } from "../entities/Subject";
import DataLoader from "dataloader";
import { AppDataSource } from "../TypeORM";

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

@Resolver(Task)
export class taskResolver {
  @Query(() => [Task])
  @UseMiddleware(isAuth)
  getAllTasks(@Ctx() { payload }: MyContext) {
    return Task.find({ where: { userId: payload?.userId } });
  }

  @FieldResolver()
  async subtasks(@Root() root: Task) {
    console.log("taskid", root.id);
    return subtaskLoader.load(root.id);
  }

  @FieldResolver()
  async subject(@Root() root: Task) {
    if (root.subjectId) {
      return subjectLoader.load(root.subjectId);
    } else {
      return null;
    }
  }

  @Mutation(() => Task)
  @UseMiddleware(isAuth)
  async createTask(
    @Arg("name") name: string,
    @Arg("subjectId", { nullable: true }) subjectId: string,
    @Arg("dueDate", { nullable: true }) dueDate: Date,
    @Ctx() { payload }: MyContext
  ) {
    console.log(name);
    const result = await AppDataSource.createQueryBuilder()
      .insert()
      .into(Task)
      .values({ name, userId: payload?.userId, subjectId, dueDate: dueDate })
      .returning("*")
      .execute();
    return result.raw[0];
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteTask(@Ctx() { payload }: MyContext, @Arg("id") id: string) {
    const task = await Task.findOne({ where: { id } });
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

  @Mutation(() => Task)
  @UseMiddleware(isAuth)
  async toggleTask(
    @Ctx() { payload }: MyContext,
    @Arg("id") id: string
  ): Promise<Task> {
    const task = await Task.findOne({ where: { id } });
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
      throw new Error("you are not authorized for this action");
    }
  }

  @Mutation(() => Task)
  @UseMiddleware(isAuth)
  async changeSubjectOfTask(
    @Ctx() { payload }: MyContext,
    @Arg("subjectId") subjectId: string,
    @Arg("taskId") taskId: string
  ) {
    const result = await Task.createQueryBuilder("task")
      .update()
      .set({ subjectId })
      .where('task.id = :taskId and task."userId" = :userId', {
        taskId,
        userId: payload?.userId,
      })
      .returning("*")
      .execute();
    if (result.raw.length == 0) {
      throw new Error("you are not authorized for this action");
    }
    return result.raw[0];
  }

  @Mutation(() => Task)
  @UseMiddleware(isAuth)
  async editTask(
    @Ctx() { payload }: MyContext,
    @Arg("name") name: string,
    @Arg("text", { nullable: true }) text: string,
    @Arg("id") id: string,
    @Arg("dueDate", { nullable: true }) dueDate?: Date,
    @Arg("doDate", { nullable: true }) doDate?: Date
  ) {
    const task = await Task.findOne({ where: { id } });
    if (task?.userId === payload?.userId && task) {
      task.name = name;
      task.text = text;
      task.doDate = doDate;
      task.dueDate = dueDate;
      task.save();
      return task;
    } else {
      throw new Error(
        "your are not authorized for this action or the task doesn't exist"
      );
    }
  }
}
