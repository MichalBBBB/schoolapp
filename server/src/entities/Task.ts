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
  @Field({ nullable: true })
  dueDate?: Date;

  @Column({ nullable: true })
  @Field({ nullable: true })
  doDate?: Date;

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

  @ManyToOne(() => Subject, (subject) => subject.tasks, { nullable: true })
  @Field(() => Subject, { nullable: true })
  subject: Relation<Subject>;

  @Column({ nullable: true })
  @Field({ nullable: true })
  subjectId: string;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;
}
