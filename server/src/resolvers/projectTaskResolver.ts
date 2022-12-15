import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { ProjectTask } from "../entities/ProjectTask";
import { User } from "../entities/User";
import { isAuth } from "../middleware/isAuth";
import { isUserInProject } from "../utils/isUserInProject";
import { MyContext } from "../utils/MyContext";

@Resolver(ProjectTask)
export class projectTaskResolver {
  @FieldResolver()
  async publicUsers(@Root() root: ProjectTask) {
    console.log("here");
    const fetchedProjectTask = await ProjectTask.findOne({
      where: { id: root.id },
      relations: { users: true },
    });
    return fetchedProjectTask?.users.map((item) => {
      return {
        name: item.fullName,
        email: item.email,
        id: item.id,
      };
    });
  }

  @Mutation(() => ProjectTask)
  @UseMiddleware(isAuth)
  async addProjectTask(
    @Arg("name") name: string,
    @Arg("projectId") projectId: string,
    @Arg("dueDate", { nullable: true }) dueDate?: Date
  ) {
    return ProjectTask.create({ projectId: projectId, name, dueDate }).save();
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
        await ProjectTask.createQueryBuilder()
          .relation("users")
          .of(projectTask)
          .add(user);
        return projectTask;
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
    const user = await User.findOne({ where: { id: userId } });
    if (projectTask) {
      if (
        (await isUserInProject(projectTask.projectId, userId)) &&
        (await isUserInProject(projectTask.projectId, payload?.userId || ""))
      ) {
        await ProjectTask.createQueryBuilder()
          .relation("users")
          .of(projectTask)
          .remove(user);
        return projectTask;
      } else {
        throw new Error("user is not a member of the project");
      }
    } else {
      throw new Error("task or user wasn't found");
    }
  }
}
