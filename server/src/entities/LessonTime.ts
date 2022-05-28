import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
@ObjectType()
export class LessonTime extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @Field()
  id: String;

  @Column()
  @Field()
  startTime: Date;

  @Column()
  @Field()
  endTime: Date;

  @ManyToOne(() => User, (user) => user.lessonTimes, { onDelete: "CASCADE" })
  user: User;

  @Column()
  userId: String;
}
