import { Project } from "../entities/Project";

export const isUserInProject = async (id: string, userId: string) => {
  const project = await Project.findOne({
    where: { id },
    relations: { userProjects: true },
  });
  console.log(project);
  return project?.userProjects.some((userProject) => {
    return userProject.userId == userId;
  });
};
