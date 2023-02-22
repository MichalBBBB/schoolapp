import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from "typeorm";
import { Task } from "./Task";
import { User } from "./User";

@Entity()
@ObjectType()
export class Reminder extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @Field()
  id: string;

  @Field()
  @Column()
  minutesBefore: number;

  @Field()
  @Column()
  title: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  body?: string;

  @ManyToOne(() => Task, (task) => task.reminders)
  @Field(() => Task)
  task: Relation<Task>;

  @Column()
  @Field()
  taskId: string;

  @Column()
  @Field()
  date: Date;

  @ManyToOne(() => User, (user) => user.reminders)
  user: Relation<User>;

  @Column()
  userId: string;
}
