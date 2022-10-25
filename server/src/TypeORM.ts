import { DataSource } from "typeorm";
import { Subject } from "./entities/Subject";
import { CalendarEvent } from "./entities/CalendarEvent";
import { LessonTime } from "./entities/LessonTime";
import { Subtask } from "./entities/Subtask";
import { Task } from "./entities/Task";
import { User } from "./entities/User";
import { Lesson } from "./entities/Lesson";

export const AppDataSource = new DataSource({
  type: "postgres",
  username: "postgres",
  password: "postgres",
  database: "schoolapp",
  logging: true,
  synchronize: true,
  entities: [User, Task, Subtask, Subject, CalendarEvent, LessonTime, Lesson],
});
