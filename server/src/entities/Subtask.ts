import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Task } from "./Task";

@Entity()
@ObjectType()
export class Subtask extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @Field()
  id: string;

  @ManyToOne(() => Task, (task) => task.subtasks, { onDelete: "CASCADE" })
  task: Task;

  @Column()
  @Field()
  taskId: string;

  @Column()
  @Field()
  name: string;

  @Column({ default: false })
  @Field()
  done: boolean;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;

  @CreateDateColumn()
  @Field()
  createdAt: Date;
}
