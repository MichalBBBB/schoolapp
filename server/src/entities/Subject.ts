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
import { CalendarEvent } from "./CalendarEvent";
import { Lesson } from "./Lesson";
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

  @ManyToOne(() => User, (user) => user.subjects, { onDelete: "CASCADE" })
  user: User;

  @OneToMany(() => CalendarEvent, (event) => event.subject, { nullable: true })
  calendarEvents: CalendarEvent[];

  @Column()
  userId: string;

  @OneToMany(() => Lesson, (lesson) => lesson.subject)
  @Field(() => [Lesson])
  lessons: Relation<Lesson>[];

  @Field()
  @Column()
  colorName: string;
}
