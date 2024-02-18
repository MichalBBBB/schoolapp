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
import { PublicUser, User } from "../entities/User";
import { UserProject } from "../entities/UserProject";
import { isAuth } from "../middleware/isAuth";
import { queueMiddleware } from "../middleware/queueMiddleware";
import { AppDataSource } from "../TypeORM";
import { MyContext } from "../utils/MyContext";
import { In } from "typeorm";
import { messaging } from "firebase-admin";

@ObjectType()
class Invite {
  @Field()
  adminName: string;

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
          // create a unique id for this public user object (it is unique for the project)
          id: `${item.projectId}:${item.user.id}`,
          name: item.user.fullName,
          email: item.user.email,
          userId: item.user.id,
          isAdmin: item.isAdmin,
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
    return Project.find({ relations: { userProjects: true } });
  }
  @FieldResolver()
  async members(@Root() root: Project) {
    return membersLoader.load(root.id);
  }
  @FieldResolver()
  async isAdmin(@Root() root: Project, @Ctx() { payload }: MyContext) {
    const members = await membersLoader.load(root.id);
    if (
      members.some((item) => item.userId == payload?.userId && item.isAdmin)
    ) {
      return true;
    } else {
      return false;
    }
  }

  @Query(() => [Project])
  @UseMiddleware(isAuth)
  async getProjects(@Ctx() { payload }: MyContext) {
    const projects = await Project.createQueryBuilder("project")
      .select()
      .innerJoin(
        "project.userProjects",
        "userProject",
        '"userProject"."userId" = :id AND "userProject".accepted = :accepted',
        { id: payload?.userId, accepted: true }
      )
      .leftJoinAndSelect("project.tasks", "projectTask")
      .getMany();
    // console.log(projects);
    return projects;
  }

  @Mutation(() => Project)
  @UseMiddleware(isAuth)
  @UseMiddleware(queueMiddleware)
  async createProject(
    @Ctx() { payload }: MyContext,
    @Arg("name") name: string,
    @Arg("memberEmails", () => [String]) memberEmails: string[],
    @Arg("id", { nullable: true }) id?: string
  ) {
    const project = await Project.create({
      name,
      id,
    }).save();
    await AppDataSource.transaction(async (transactionEntityManager) => {
      memberEmails.forEach(async (item) => {
        const user = await transactionEntityManager.findOne(User, {
          where: { email: item },
        });
        if (user) {
          await transactionEntityManager
            .create(UserProject, {
              projectId: project.id,
              userId: user?.id,
              accepted: false,
            })
            .save();
        } else {
          throw new Error("User not found");
        }
      });
      await transactionEntityManager
        .create(UserProject, {
          projectId: project.id,
          userId: payload?.userId,
          accepted: true,
          isAdmin: true,
        })
        .save();
    });
    // send push notification to each added member
    const addedMembers = await User.find({
      where: { email: In(memberEmails) },
    });
    const admin = await User.findOne({ where: { id: payload?.userId } });
    if (admin && addedMembers) {
      console.log("should send notification");
      addedMembers.forEach((member) => {
        member.tokens.forEach((token) => {
          messaging().send({
            token,
            notification: {
              title: "Dayto",
              body: `${admin.fullName} has added you to project ${name}`,
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
        });
      });
    }

    return Project.findOne({
      where: { id: project.id },
      relations: { tasks: true },
    });
  }

  @Mutation(() => Project)
  @UseMiddleware(isAuth)
  @UseMiddleware(queueMiddleware)
  async editProject(
    @Arg("id") id: string,
    @Arg("name") name: string,
    @Arg("text", { nullable: true }) text: string,
    @Ctx() { payload }: MyContext
  ) {
    const project = await Project.findOne({
      where: { id },
      relations: { userProjects: true, tasks: true },
    });
    if (project?.userProjects.some((item) => item.userId == payload?.userId)) {
      project.name = name;
      project.text = text;
      project.save();
      return project;
    } else {
      throw new Error("you don't have authority");
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  @UseMiddleware(queueMiddleware)
  async deleteProject(@Arg("id") id: string, @Ctx() { payload }: MyContext) {
    const project = await Project.findOne({
      where: { id },
      relations: { userProjects: true },
    });
    if (
      project &&
      project?.userProjects.some(
        (item) => item.userId == payload?.userId && item.isAdmin
      )
    ) {
      await project.remove();
      return true;
    } else {
      return false;
    }
  }

  @Mutation(() => Project)
  @UseMiddleware(isAuth)
  @UseMiddleware(queueMiddleware)
  async addMemberToProject(
    @Arg("projectId") projectId: string,
    @Arg("memberEmail") memberEmail: string,
    @Ctx() { payload }: MyContext
  ) {
    const project = await Project.findOne({
      where: { id: projectId },
      relations: { userProjects: true },
    });
    const user = await User.findOne({ where: { email: memberEmail } });
    if (
      user &&
      project &&
      project?.userProjects.some(
        (item) => item.userId == payload?.userId && item.isAdmin
      )
    ) {
      await UserProject.create({
        userId: user.id,
        projectId,
        accepted: false,
      }).save();
      const admin = await User.findOne({ where: { id: payload?.userId } });
      if (admin) {
        user.tokens.forEach((token) => {
          messaging().send({
            token,
            notification: {
              title: "Dayto",
              body: `${admin.fullName} has added you to project ${project.name}`,
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
                sound: "default",
              },
            },
          });
        });
      }
    }

    return Project.findOne({
      where: { id: projectId },
      relations: { tasks: true },
    });
  }

  @Mutation(() => Project)
  @UseMiddleware(isAuth)
  @UseMiddleware(queueMiddleware)
  async removeMemberFromProject(
    @Arg("projectId") projectId: string,
    @Arg("memberId") memberId: string,
    @Ctx() { payload }: MyContext
  ) {
    const userProject = await UserProject.findOne({
      where: { userId: memberId, projectId },
    });
    const project = await Project.findOne({
      where: { id: projectId },
      relations: { userProjects: true },
    });
    if (
      project &&
      project?.userProjects.some(
        (item) => item.userId == payload?.userId && item.isAdmin
      ) &&
      memberId !== payload?.userId
    ) {
      await userProject?.remove();
    }
    return Project.findOne({
      where: { id: projectId },
      relations: { tasks: true },
    });
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  @UseMiddleware(queueMiddleware)
  async makeMemberAdmin(
    @Arg("memberId") memberId: string,
    @Arg("projectId") projectId: string,
    @Ctx() { payload }: MyContext
  ) {
    const currentAdmin = await UserProject.findOne({
      where: { userId: payload?.userId, isAdmin: true, projectId },
    });
    const newAdmin = await UserProject.findOne({
      where: { userId: memberId, projectId },
    });
    if (currentAdmin && newAdmin) {
      currentAdmin.isAdmin = false;
      await currentAdmin.save();
      newAdmin.isAdmin = true;
      await newAdmin?.save();
      return true;
    } else {
      throw new Error("An error occured");
    }
  }

  @Mutation(() => Project)
  @UseMiddleware(isAuth)
  @UseMiddleware(queueMiddleware)
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
  @UseMiddleware(queueMiddleware)
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
    const invites: Invite[] = await Promise.all(
      userProjects.map(async (item) => {
        const admin = await UserProject.findOne({
          where: { projectId: item.project.id, isAdmin: true },
          relations: { user: true },
        });
        if (admin) {
          return {
            projectId: item.project.id,
            projectName: item.project.name,
            adminName: admin.user.fullName,
          };
        } else {
          throw new Error("project owner hasn't been found");
        }
      })
    );
    return invites;
  }
}
