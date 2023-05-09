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
import { Lesson } from "./Lesson";
import { Schedule } from "./Schedule";
import { User } from "./User";

@Entity()
@ObjectType()
export class LessonTime extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @Field()
  id: string;

  @Column()
  @Field()
  startTime: string;

  @Column()
  @Field()
  endTime: string;

  @ManyToOne(() => User, (user) => user.lessonTimes, { onDelete: "CASCADE" })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Schedule, (schedule) => schedule.lessonTimes, {
    nullable: true,
    onDelete: "CASCADE",
  })
  schedule?: Relation<Schedule>;

  @Column({ nullable: true })
  @Field({ nullable: true })
  scheduleId?: string;

  @OneToMany(() => Lesson, (lesson) => lesson.lessonTime)
  lessons: Relation<Lesson>[];
}
