import { FieldResolver, Resolver, Root } from "type-graphql";
import { ProjectTask } from "../entities/ProjectTask";

@Resolver(ProjectTask)
export class projectTaskResolver {
  @FieldResolver()
  async publicUsers(@Root() root: ProjectTask) {
    console.log("here");
    const fetchedProjectTask = await ProjectTask.findOne({
      where: { id: root.id },
      relations: { users: true },
    });
    console.log(fetchedProjectTask);
    return fetchedProjectTask?.users.map((item) => {
      return {
        name: item.fullName,
        email: item.email,
        id: item.id,
      };
    });
  }
}
