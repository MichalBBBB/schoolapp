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
import { Reminder } from "./Reminder";
import { Subject } from "./Subject";
import { Subtask } from "./Subtask";
import { User } from "./User";

@Entity()
@ObjectType()
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @Field()
  id: string;

  @Column()
  @Field()
  name: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  text: string;

  @Column({ nullable: true })
  @Field(() => Date, { nullable: true })
  dueDate?: Date;

  @Column({ default: true })
  @Field()
  dueDateIncludesTime: boolean;

  @Column({ nullable: true })
  @Field(() => Date, { nullable: true })
  doDate?: Date;

  @Column({ default: true })
  @Field()
  doDateIncludesTime: boolean;

  @ManyToOne(() => User, (user) => user.tasks, {
    onDelete: "CASCADE",
  })
  @Field(() => User)
  user: Relation<User>;

  @Column()
  @Field()
  userId: string;

  @Column({ default: false })
  @Field()
  done: boolean;

  @OneToMany(() => Subtask, (subtask) => subtask.task)
  @Field(() => [Subtask])
  subtasks: Relation<Subtask>[];

  @ManyToOne(() => Subject, (subject) => subject.tasks, {
    nullable: true,
    onDelete: "SET NULL",
  })
  @Field(() => Subject, { nullable: true })
  subject: Relation<Subject>;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  subjectId?: string;

  @OneToMany(() => Reminder, (reminder) => reminder.task)
  @Field(() => [Reminder])
  reminders: Relation<Reminder>[];

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;
}
