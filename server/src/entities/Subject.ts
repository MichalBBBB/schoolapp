import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Task } from "./Task";
import { User } from "./User";

@Entity()
@ObjectType()
export class Subject extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @Field()
  id: string;

  @Column()
  @Field()
  name: string;

  @OneToMany(() => Task, (task) => task.subject, { nullable: true })
  tasks: Task[];

  @ManyToOne(() => User, (user) => user.subjects)
  user: User;
}
