import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Subject } from "./Subject";
import { User } from "./User";

@Entity()
@ObjectType()
export class CalendarEvent extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @Field()
  id: String;

  @Column()
  @Field()
  name: String;

  @Column()
  @Field()
  startDate: Date;

  @Column({ nullable: true })
  @Field({ nullable: true })
  endDate: Date;

  @Column({ default: false })
  @Field()
  wholeDay: Boolean;

  @Column({ nullable: true })
  @Field({ nullable: true })
  subjectId: String;

  @ManyToOne(() => Subject, (subject) => subject.calendarEvents, {
    nullable: true,
  })
  @Field(() => Subject, { nullable: true })
  subject: Subject;

  @ManyToOne(() => User, (user) => user.events)
  @Field(() => User)
  user: User;

  @Column()
  @Field()
  userId: String;
}
