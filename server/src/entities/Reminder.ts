import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from "typeorm";
import { CalendarEvent } from "./CalendarEvent";
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

  @ManyToOne(() => Task, (task) => task.reminders, { nullable: true })
  @Field(() => Task, { nullable: true })
  task?: Relation<Task>;

  @ManyToOne(() => CalendarEvent, (event) => event.reminders, {
    nullable: true,
  })
  @Field(() => CalendarEvent, { nullable: true })
  event?: Relation<CalendarEvent>;

  @Column({ nullable: true })
  @Field({ nullable: true })
  taskId?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  eventId?: string;

  @Column()
  @Field()
  date: Date;

  @ManyToOne(() => User, (user) => user.reminders)
  user: Relation<User>;

  @Column()
  userId: string;
}
