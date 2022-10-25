import { WEEK_DAYS } from "../types/weekDays";
import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from "typeorm";
import { LessonTime } from "./LessonTime";
import { Subject } from "./Subject";
import { User } from "./User";

@Entity()
@ObjectType()
export class Lesson extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @Field()
  id!: string;

  @Column({
    type: "varchar",
    enum: WEEK_DAYS,
  })
  @Field(() => String)
  dayOfTheWeek!: WEEK_DAYS;

  @ManyToOne(() => LessonTime, (lessonTime) => lessonTime.lessons, {
    onDelete: "CASCADE",
  })
  @Field(() => LessonTime)
  lessonTime: Relation<LessonTime>;

  @Column()
  @Field()
  lessonTimeId: string;

  @ManyToOne(() => Subject, (subject) => subject.lessons, {
    onDelete: "CASCADE",
  })
  @Field(() => Subject)
  subject: Relation<Subject>;

  @Column()
  @Field()
  subjectId: string;

  @ManyToOne(() => User, (user) => user.lessons)
  user: Relation<User>;

  @Column()
  @Field()
  userId: string;
}