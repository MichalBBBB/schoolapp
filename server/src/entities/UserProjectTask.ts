import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Entity,
  ManyToOne,
  PrimaryColumn,
  Relation,
} from "typeorm";
import { Project } from "./Project";
import { ProjectTask } from "./ProjectTask";
import { User } from "./User";

@Entity()
@ObjectType()
export class UserProjectTask extends BaseEntity {
  @Field()
  @PrimaryColumn()
  userId: string;

  @Field()
  @PrimaryColumn()
  projectTaskId: string;

  @ManyToOne(() => ProjectTask, (projectTask) => projectTask.userProjectTasks, {
    onDelete: "CASCADE",
  })
  @Field(() => Project)
  projectTask: Relation<ProjectTask>;

  @ManyToOne(() => User, (user) => user.userProjectTasks, {
    onDelete: "CASCADE",
  })
  @Field(() => User)
  user: Relation<User>;
}
