import DataLoader from "dataloader";
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
import { Project } from "../entities/Project";
import { ProjectTask } from "../entities/ProjectTask";
import { PublicUser, User } from "../entities/User";
import { UserProject } from "../entities/UserProject";
import { isAuth } from "../middleware/isAuth";
import { AppDataSource } from "../TypeORM";
import { MyContext } from "../utils/MyContext";

@ObjectType()
class Invite {
  @Field()
  ownerName: string;

  @Field()
  projectName: string;

  @Field()
  projectId: string;
}

const membersLoader = new DataLoader((keys) => loadMembers(keys as string[]), {
  cache: false,
});

// loading subtasks for all tasks at once
const loadMembers: (keys: string[]) => Promise<PublicUser[][]> = async (
  keys: string[]
) => {
  const result = await UserProject.createQueryBuilder("userProject")
    .select()
    .where("userProject.projectId IN (:...ids)", { ids: keys })
    .leftJoinAndSelect("userProject.user", "user")
    .getMany();
  // mapping loaded subtasks to task ids
  return keys.map((key) =>
    result
      .filter((userProject) => userProject.projectId === key)
      .map((item) => {
        const publicUser: PublicUser = {
          name: item.user.fullName,
          email: item.user.email,
          id: item.user.id,
        };
        return publicUser;
      })
  );
};

@Resolver(Project)
export class projectResolver {
  // !!! Remove !!!
  @Query(() => [Project])
  async getAllProjects() {
    console.log(await UserProject.find());
    return Project.find({ relations: { userProjects: true } });
  }
  @FieldResolver()
  async members(@Root() root: Project) {
    return membersLoader.load(root.id);
  }

  @Query(() => [Project])
  @UseMiddleware(isAuth)
  async getProjects(@Ctx() { payload }: MyContext) {
    const projects = await Project.createQueryBuilder("project")
      .select()
      .leftJoin(
        "project.userProjects",
        "userProject",
        '"userProject"."userId" = :id',
        { id: payload?.userId }
      )
      .leftJoinAndSelect("project.tasks", "projectTask")
      .getMany();
    console.log(projects);
    console.log(await Project.find({ relations: { tasks: true } }));
    return projects;
  }

  @Mutation(() => Project)
  @UseMiddleware(isAuth)
  async createProject(
    @Ctx() { payload }: MyContext,
    @Arg("name") name: string,
    @Arg("memberEmails", () => [String]) memberEmails: string[]
  ) {
    const project = await Project.create({
      ownerId: payload?.userId,
      name,
    }).save();
    await AppDataSource.transaction(async (transactionEntityManager) => {
      memberEmails.forEach(async (item) => {
        const user = await transactionEntityManager.findOne(User, {
          where: { email: item },
        });
        console.log(user);
        if (user) {
          await transactionEntityManager
            .create(UserProject, {
              projectId: project.id,
              userId: user?.id,
              accepted: false,
            })
            .save();
        }
      });
      await transactionEntityManager
        .create(UserProject, {
          projectId: project.id,
          userId: payload?.userId,
          accepted: true,
        })
        .save();
    });
    return Project.findOne({
      where: { id: project.id },
      relations: { tasks: true },
    });
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteProject(@Arg("id") id: string, @Ctx() { payload }: MyContext) {
    const project = await Project.findOne({
      where: { id, ownerId: payload?.userId },
    });
    if (project) {
      await project.remove();
      return true;
    } else {
      return false;
    }
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

  @Mutation(() => Project)
  @UseMiddleware(isAuth)
  async addMembersToProject(
    @Arg("projectId") projectId: string,
    @Arg("memberEmails", () => [String]) memberEmails: string[]
  ) {
    await AppDataSource.transaction(async (transactionEntityManager) => {
      memberEmails.forEach(async (item) => {
        const user = await transactionEntityManager.findOne(User, {
          where: { email: item },
        });
        if (user) {
          transactionEntityManager
            .create(UserProject, {
              projectId: projectId,
              userId: user?.id,
              accepted: false,
            })
            .save();
        }
      });
    });
  }

  @Mutation(() => Project)
  @UseMiddleware(isAuth)
  async acceptProjectInvite(
    @Arg("id") id: string,
    @Ctx() { payload }: MyContext
  ) {
    const userProject = await UserProject.findOne({
      where: { userId: payload?.userId, projectId: id },
    });
    if (userProject) {
      userProject.accepted = true;
      userProject.save();
      return Project.findOne({ where: { id }, relations: { tasks: true } });
    } else {
      throw new Error("You weren't invited to this project");
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async declineProjectInvite(
    @Arg("id") id: string,
    @Ctx() { payload }: MyContext
  ) {
    const userProject = await UserProject.findOne({
      where: { userId: payload?.userId, projectId: id },
    });
    if (userProject) {
      userProject.remove();
      return true;
    } else {
      throw new Error("You weren't invited to this project");
    }
  }

  @Query(() => [Invite])
  @UseMiddleware(isAuth)
  async getInvites(@Ctx() { payload }: MyContext) {
    const userProjects = await UserProject.find({
      where: { userId: payload?.userId, accepted: false },
      relations: { project: true, user: true },
    });
    const invites: Invite[] = userProjects.map((item) => {
      return {
        projectId: item.project.id,
        projectName: item.project.name,
        ownerName: item.user.fullName,
      };
    });
    return invites;
  }
}
