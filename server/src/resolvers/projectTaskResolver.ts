import DataLoader from "dataloader";
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
import { Project } from "../entities/Project";
import { ProjectTask } from "../entities/ProjectTask";
import { PublicUser, User } from "../entities/User";
import { UserProjectTask } from "../entities/UserProjectTask";
import { isAuth } from "../middleware/isAuth";
import { isUserInProject } from "../utils/isUserInProject";
import { MyContext } from "../utils/MyContext";

const projectLoader = new DataLoader((keys) => loadProjects(keys as [string]), {
  cache: false,
});

const loadProjects = async (keys: [string]) => {
  const result = await Project.createQueryBuilder("project")
    .select()
    .where("project.id IN (:...ids)", { ids: keys })
    .getMany();
  return keys.map((key) => result.find((project) => project.id === key));
};

const usersLoader = new DataLoader((keys) => loadUsers(keys as string[]), {
  cache: false,
});

// loading subtasks for all tasks at once
const loadUsers: (keys: string[]) => Promise<PublicUser[][]> = async (
  keys: string[]
) => {
  const result = await UserProjectTask.createQueryBuilder("userProjectTask")
    .select()
    .where("userProjectTask.projectTaskId IN (:...ids)", { ids: keys })
    .leftJoinAndSelect("userProjectTask.user", "user")
    .getMany();
  // mapping loaded subtasks to task ids
  return keys.map((key) =>
    result
      .filter((userProject) => userProject.projectTaskId === key)
      .map((item) => {
        const publicUser: PublicUser = {
          // create a unique id for this public user object (it is unique for the projectTask)
          id: `${item.projectTaskId}:${item.user.id}`,
          name: item.user.fullName,
          email: item.user.email,
          userId: item.user.id,
        };
        return publicUser;
      })
  );
};

@Resolver(ProjectTask)
export class projectTaskResolver {
  @FieldResolver(() => Project)
  async project(@Root() root: ProjectTask) {
    return projectLoader.load(root.projectId);
  }

  @FieldResolver()
  async publicUsers(@Root() root: ProjectTask) {
    return usersLoader.load(root.id);
  }

  @Mutation(() => ProjectTask)
  @UseMiddleware(isAuth)
  async addProjectTask(
    @Arg("name") name: string,
    @Arg("projectId") projectId: string,
    @Arg("dueDate", { nullable: true }) dueDate?: Date,
    @Arg("doDate", { nullable: true }) doDate?: Date
  ) {
    return ProjectTask.create({
      projectId: projectId,
      name,
      dueDate,
      doDate,
    }).save();
  }

  @Mutation(() => ProjectTask)
  @UseMiddleware(isAuth)
  async editProjectTask(
    @Arg("id") id: string,
    @Arg("name") name: string,
    @Arg("dueDate", { nullable: true }) dueDate?: Date,
    @Arg("doDate", { nullable: true }) doDate?: Date
  ) {
    const projectTask = await ProjectTask.findOne({ where: { id } });
    if (projectTask) {
      projectTask.name = name;
      projectTask.dueDate = dueDate;
      projectTask.doDate = doDate;
      await projectTask.save();
      return projectTask;
    } else {
      throw new Error("task wasn't found");
    }
  }

  @Mutation(() => ProjectTask)
  @UseMiddleware(isAuth)
  async toggleProjectTask(
    @Arg("id") id: string,
    @Ctx() { payload }: MyContext
  ) {
    const projectTask = await ProjectTask.findOne({ where: { id } });
    if (
      projectTask &&
      (await isUserInProject(projectTask.projectId, payload?.userId || ""))
    ) {
      projectTask.done = !projectTask.done;
      await projectTask.save();
      return projectTask;
    } else {
      throw new Error("task wasn't found");
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteProjectTask(
    @Arg("id") id: string,
    @Ctx() { payload }: MyContext
  ) {
    const projectTask = await ProjectTask.findOne({ where: { id } });
    if (
      projectTask &&
      (await isUserInProject(projectTask.projectId, payload?.userId || ""))
    ) {
      await projectTask.remove();
      return true;
    } else {
      return false;
    }
  }

  @Mutation(() => ProjectTask)
  @UseMiddleware(isAuth)
  async assignMember(
    @Arg("userId") userId: string,
    @Arg("taskId") taskId: string,
    @Ctx() { payload }: MyContext
  ) {
    const projectTask = await ProjectTask.findOne({ where: { id: taskId } });
    const user = await User.findOne({ where: { id: userId } });
    if (projectTask && user) {
      if (
        (await isUserInProject(projectTask.projectId, userId)) &&
        (await isUserInProject(projectTask.projectId, payload?.userId || ""))
      ) {
        await UserProjectTask.create({ userId, projectTaskId: taskId }).save();
        return ProjectTask.findOne({ where: { id: taskId } });
      } else {
        throw new Error("user is not a member of the project");
      }
    } else {
      throw new Error("task or user wasn't found");
    }
  }

  @Mutation(() => ProjectTask)
  @UseMiddleware(isAuth)
  async removeAssignedMember(
    @Arg("userId") userId: string,
    @Arg("taskId") taskId: string,
    @Ctx() { payload }: MyContext
  ) {
    const projectTask = await ProjectTask.findOne({ where: { id: taskId } });
    if (projectTask) {
      if (
        (await isUserInProject(projectTask.projectId, userId)) &&
        (await isUserInProject(projectTask.projectId, payload?.userId || ""))
      ) {
        const userProjectTask = await UserProjectTask.findOne({
          where: { userId, projectTaskId: taskId },
        });
        await userProjectTask?.remove();
        return projectTask;
      } else {
        throw new Error("user is not a member of the project");
      }
    } else {
      throw new Error("task or user wasn't found");
    }
  }

  @Query(() => [ProjectTask])
  @UseMiddleware(isAuth)
  async getProjectTasksOfUser(@Ctx() { payload }: MyContext) {
    const projectTasks = await ProjectTask.createQueryBuilder("projectTask")
      .select()
      .innerJoin(
        "projectTask.userProjectTasks",
        "userProjectTask",
        '"userProjectTask"."userId" = :id',
        { id: payload?.userId }
      )
      .getMany();
    console.log(projectTasks);
    return projectTasks;
  }
}
