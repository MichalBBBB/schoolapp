import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from "typeorm";
import { Project } from "./Project";
import { PublicUser } from "./User";
import { UserProjectTask } from "./UserProjectTask";

@Entity()
@ObjectType()
export class ProjectTask extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @Field()
  id: string;

  @Column()
  @Field()
  name: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  text: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  dueDate?: Date;

  @Column({ nullable: true })
  @Field({ nullable: true })
  doDate?: Date;

  @OneToMany(
    () => UserProjectTask,
    (userProjectTask) => userProjectTask.projectTask
  )
  @Field(() => [UserProjectTask])
  userProjectTasks: Relation<UserProjectTask>[];

  @Field(() => [PublicUser])
  publicUsers: PublicUser[];

  @Column({ default: false })
  @Field()
  done: boolean;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;

  @ManyToOne(() => Project, (project) => project.tasks, { onDelete: "CASCADE" })
  project: Relation<Project>;

  @Field()
  @Column()
  projectId: string;
}
