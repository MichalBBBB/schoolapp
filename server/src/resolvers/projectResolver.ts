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
    .where('"userProject".projectId IN (:...ids)', { ids: keys })
    .leftJoinAndSelect('"userProject".user', "user")
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
        'project."userProject"',
        "userProject",
        '"userProject"."userId" = :id',
        { id: payload?.userId }
      )
      .leftJoinAndSelect("project.tasks", '"ProjectTask"')
      .getMany();
    console.log(projects);
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
        if (user) {
          transactionEntityManager.create(UserProject, {
            projectId: project.id,
            userId: user?.id,
          });
        }
      });
      transactionEntityManager.create(UserProject, {
        projectId: project.id,
        userId: payload?.userId,
      });
    });
  }

  @Mutation(() => ProjectTask)
  @UseMiddleware(isAuth)
  async addProjectTask(
    @Arg("name") name: string,
    @Arg("dueDate") dueDate: Date,
    @Arg("projectId") projectId: string
  ) {
    return ProjectTask.create({ projectId: projectId, name, dueDate });
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
          transactionEntityManager.create(UserProject, {
            projectId: projectId,
            userId: user?.id,
          });
        }
      });
    });
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
