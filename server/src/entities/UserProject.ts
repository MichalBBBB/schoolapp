import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
  Relation,
} from "typeorm";
import { Project } from "./Project";
import { User } from "./User";

@Entity()
@ObjectType()
export class UserProject extends BaseEntity {
  @Field()
  @PrimaryColumn()
  userId: string;

  @Field()
  @PrimaryColumn()
  projectId: string;

  @ManyToOne(() => Project, (project) => project.userProjects)
  @Field(() => Project)
  project: Relation<Project>;

  @ManyToOne(() => User, (user) => user.userProjects)
  @Field(() => User)
  user: Relation<User>;

  @Field(() => Boolean)
  @Column()
  accepted: boolean;
}
