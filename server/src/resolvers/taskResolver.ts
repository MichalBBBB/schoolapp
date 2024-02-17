import { Task } from "../entities/Task";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../utils/MyContext";
import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  InputType,
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
import { queueMiddleware } from "../middleware/queueMiddleware";
import { Reminder } from "../entities/Reminder";
import { messaging } from "firebase-admin";
import { User } from "../entities/User";

@InputType()
export class RemindersInput implements Partial<Reminder> {
  @Field()
  id: string;

  @Field()
  minutesBefore: number;

  @Field()
  title: string;

  @Field({ nullable: true })
  body?: string;

  @Field()
  date: Date;
}

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

const remindersLoader = new DataLoader(
  (keys) => loadReminders(keys as [string]),
  {
    cache: false,
  }
);

const loadReminders = async (keys: [string]) => {
  const result = await Reminder.createQueryBuilder("reminder")
    .select()
    .where("reminder.taskId IN (:...ids)", { ids: keys })
    .getMany();
  return keys.map((key) =>
    result.filter((reminder) => reminder.taskId === key)
  );
};

@Resolver(Task)
export class taskResolver {
  @Query(() => [Task])
  @UseMiddleware(isAuth)
  async getAllTasks(@Ctx() { payload }: MyContext) {
    return Task.find({
      where: { userId: payload?.userId },
      order: { createdAt: "ASC" },
    });
  }

  @FieldResolver()
  async subtasks(@Root() root: Task) {
    return subtaskLoader.load(root.id);
  }

  @FieldResolver()
  async reminders(@Root() root: Task) {
    return remindersLoader.load(root.id);
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
  @UseMiddleware(queueMiddleware)
  async createTask(
    @Ctx() { payload }: MyContext,
    @Arg("id") id: string,
    @Arg("name") name: string,
    @Arg("subjectId", { nullable: true }) subjectId?: string,
    @Arg("dueDate", { nullable: true }) dueDate?: Date,
    @Arg("dueDateIncludesTime", { nullable: true })
    dueDateIncludesTime?: boolean,
    @Arg("doDate", { nullable: true }) doDate?: Date,
    @Arg("doDateIncludesTime", { nullable: true })
    doDateIncludesTime?: boolean
  ) {
    const user = await User.findOne({ where: { id: payload?.userId } });
    setTimeout(() => {
      messaging().send({
        token: user!.tokens.splice(-1)[0],
        notification: {
          title: "Dayto",
          body: `someone has added you to project ${name}`,
        },
        apns: {
          payload: {
            aps: {
              sound: "default",
            },
          },
        },
        android: {
          notification: {
            channelId: "messages",
            sound: "default",
            icon: "ic_small_icon",
          },
        },
      });
    }, 10000);

    const result = await AppDataSource.createQueryBuilder()
      .insert()
      .into(Task)
      .values({
        id,
        name,
        userId: payload?.userId,
        subjectId,
        dueDate: dueDate,
        doDate,
        doDateIncludesTime: doDateIncludesTime || false,
        dueDateIncludesTime: dueDateIncludesTime || false,
      })
      .returning("*")
      .execute();
    return result.raw[0];
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  @UseMiddleware(queueMiddleware)
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
  @UseMiddleware(queueMiddleware)
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
  @UseMiddleware(queueMiddleware)
  async editTask(
    @Ctx() { payload }: MyContext,
    @Arg("name") name: string,
    @Arg("text", { nullable: true }) text: string,
    @Arg("id") id: string,
    @Arg("dueDate", { nullable: true }) dueDate?: Date,
    @Arg("dueDateIncludesTime", { nullable: true })
    dueDateIncludesTime?: boolean,
    @Arg("doDate", { nullable: true }) doDate?: Date,
    @Arg("doDateIncludesTime", { nullable: true }) doDateIncludesTime?: boolean,
    @Arg("duration", { nullable: true }) duration?: number,
    @Arg("reminders", () => [RemindersInput], { nullable: true })
    reminders?: RemindersInput[],
    @Arg("subjectId", { nullable: true }) subjectId?: string
  ) {
    const task = await Task.findOne({ where: { id } });
    if (task?.userId === payload?.userId && task) {
      // important - if we don't provide reminders, nothing should be changed,
      // only if empty array is provided
      if (reminders) {
        await AppDataSource.transaction(async (transactionEntityManager) => {
          await transactionEntityManager.delete(Reminder, { taskId: id });
          for (const item of reminders) {
            await transactionEntityManager.insert(Reminder, {
              id: item.id,
              minutesBefore: item.minutesBefore,
              title: item.title,
              body: item.body,
              taskId: id,
              userId: payload?.userId,
              date: item.date,
            });
          }
        });
      }
      console.log(subjectId);
      task.name = name;
      task.text = text;
      task.doDate = doDate;
      task.duration = duration;
      task.doDateIncludesTime = doDateIncludesTime || false;
      task.dueDateIncludesTime = dueDateIncludesTime || false;
      task.dueDate = dueDate;
      task.subjectId = subjectId;
      await task.save();
      return task;
    } else {
      throw new Error(
        "your are not authorized for this action or the task doesn't exist"
      );
    }
  }
}
