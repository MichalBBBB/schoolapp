import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from "typeorm";
import { Subject } from "../entities/Subject";
import { CalendarEvent } from "./CalendarEvent";
import { Lesson } from "./Lesson";
import { LessonTime } from "./LessonTime";
import { Task } from "./Task";

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @Field()
  id: string;

  @Column({ default: 0 })
  tokenVersion: number;

  @Column()
  @Field()
  fullName: string;

  @Column({ unique: true })
  @Field()
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  googleId: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  imageURL: string;

  @Field(() => [Task])
  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];

  @Field(() => [Subject])
  @OneToMany(() => Subject, (subject) => subject.user)
  subjects: Subject[];

  @Field(() => [CalendarEvent])
  @OneToMany(() => CalendarEvent, (calendarEvent) => calendarEvent.user)
  events: CalendarEvent[];

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;

  @Field(() => [LessonTime])
  @OneToMany(() => LessonTime, (lessonTime) => lessonTime.user)
  lessonTimes: LessonTime[];

  @Field(() => [Lesson])
  @OneToMany(() => Lesson, (lesson) => lesson.user)
  lessons: Relation<Lesson>[];
}
