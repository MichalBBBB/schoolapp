import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
@ObjectType()
export class Settings extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @Field()
  id: string;

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
}
