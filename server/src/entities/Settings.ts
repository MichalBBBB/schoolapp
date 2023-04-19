import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from "typeorm";
import { User } from "./User";

@Entity()
@ObjectType()
export class Settings extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @Field()
  id: string;

  @OneToOne(() => User, (user) => user.settings, { onDelete: "CASCADE" })
  user: Relation<User>;

  @Column({ default: "MON" })
  @Field()
  startOfWeek: "MON" | "SUN" | "SAT";

  @Column({ default: 5 })
  @Field()
  lengthOfRotation: number;

  @Column({ default: true })
  @Field()
  skipWeekends: boolean;

  @Column()
  @Field()
  startOfRotationDate: Date;

  @Column({ default: false })
  @Field()
  darkMode: boolean;

  @Column({ default: false })
  @Field()
  showDoDate: boolean;

  @Column({ default: "DATE_ADDED" })
  @Field()
  sortTasksBy: "DATE_ADDED" | "DUE_DATE" | "DO_DATE";

  @Column({ default: false })
  @Field()
  showCompletedTasks: boolean;

  @Column({ default: true })
  @Field()
  isFirstTime: boolean;
}
