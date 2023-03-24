import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from "typeorm";
import { Subject } from "../entities/Subject";
import { CalendarEvent } from "./CalendarEvent";
import { Lesson } from "./Lesson";
import { LessonTime } from "./LessonTime";
import { Project } from "./Project";
import { ProjectTask } from "./ProjectTask";
import { Reminder } from "./Reminder";
import { Settings } from "./Settings";
import { Task } from "./Task";
import { UserProject } from "./UserProject";

@ObjectType()
export class PublicUser {
  @Field()
  id: string;

  @Field()
  email: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  isAdmin?: boolean;
}

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

  @Field(() => [ProjectTask])
  @ManyToMany(() => ProjectTask, (projectTask) => projectTask.users)
  projectTasks: ProjectTask[];

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

  @OneToMany(() => UserProject, (userProject) => userProject.user)
  @Field(() => [UserProject])
  userProjects: Relation<UserProject>[];

  @OneToMany(() => Project, (project) => project.owner)
  @Field(() => [Project])
  ownedProjects: Relation<Project>[];

  @OneToMany(() => Reminder, (reminder) => reminder.user)
  @Field(() => [Reminder])
  reminders: Relation<Reminder>;

  @OneToOne(() => Settings)
  @JoinColumn()
  @Field(() => Settings)
  settings: Relation<Settings>;

  @Column()
  @Field()
  settingsId: string;
}
