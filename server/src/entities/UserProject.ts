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

  @Field()
  @Column({ default: false })
  isAdmin: boolean;

  @ManyToOne(() => Project, (project) => project.userProjects, {
    onDelete: "CASCADE",
  })
  @Field(() => Project)
  project: Relation<Project>;

  @ManyToOne(() => User, (user) => user.userProjects, { onDelete: "CASCADE" })
  @Field(() => User)
  user: Relation<User>;

  @Field(() => Boolean)
  @Column()
  accepted: boolean;
}
