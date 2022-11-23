import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from "typeorm";
import { ProjectTask } from "./ProjectTask";
import { PublicUser, User } from "./User";
import { UserProject } from "./UserProject";

@Entity()
@ObjectType()
export class Project extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @Field()
  id: string;

  @Column()
  @Field()
  name: string;

  @OneToMany(() => UserProject, (userProject) => userProject.project)
  @Field(() => [UserProject])
  userProjects: Relation<UserProject>[];

  @Field(() => [PublicUser])
  members: PublicUser[];

  @ManyToOne(() => User, (user) => user.ownedProjects)
  @Field(() => User)
  owner: Relation<User>;

  @Column()
  @Field()
  ownerId: string;

  @OneToMany(() => ProjectTask, (projectTask) => projectTask.project)
  @Field(() => [ProjectTask])
  tasks: Relation<ProjectTask>[];
}
