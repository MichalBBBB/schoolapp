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
import { LessonTime } from "./LessonTime";
import { User } from "./User";

@ObjectType()
@Entity()
export class Schedule extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @Field()
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column({ default: false })
  default: boolean;

  @OneToMany(() => LessonTime, (lessonTime) => lessonTime.schedule)
  @Field(() => [LessonTime])
  lessonTimes: Relation<LessonTime>[];

  @ManyToOne(() => User, (user) => user.schedules, { onDelete: "CASCADE" })
  user: Relation<User>;

  @Column()
  @Field()
  userId: string;

  @Column({ nullable: true, array: true, type: "int" })
  @Field(() => [Number], { nullable: true })
  dayNumbers?: number[];

  @Column({ type: "timestamp without time zone", array: true, nullable: true })
  @Field(() => [Date], { nullable: true })
  dates?: Date[];

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;
}
