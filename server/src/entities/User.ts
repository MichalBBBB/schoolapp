import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Subject } from "../entities/Subject";
import { Task } from "./Task";

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @Field()
  id: string;

  @Column({ default: 0 })
  tokenVersion: number;

  @Column()
  @Field()
  fullName: string;

  @Column({ unique: true })
  @Field()
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  googleId: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  imageURL: string;

  @Field(() => [Task])
  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];

  @Field(() => [Subject])
  @OneToMany(() => Subject, (subject) => subject.user)
  subjects: Subject[];

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;
}
