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
import { Reminder } from "./Reminder";
import { Subject } from "./Subject";
import { User } from "./User";

@Entity()
@ObjectType()
export class CalendarEvent extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @Field()
  id: string;

  @Column()
  @Field()
  name: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  text?: string;

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
    onDelete: "SET NULL",
  })
  @Field(() => Subject, { nullable: true })
  subject?: Subject;

  @OneToMany(() => Reminder, (reminder) => reminder.event)
  @Field(() => [Reminder])
  reminders: Relation<Reminder>[];

  @ManyToOne(() => User, (user) => user.events)
  @Field(() => User)
  user: User;

  @Column()
  @Field()
  userId: string;
}
