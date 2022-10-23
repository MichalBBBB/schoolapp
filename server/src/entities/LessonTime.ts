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
}
