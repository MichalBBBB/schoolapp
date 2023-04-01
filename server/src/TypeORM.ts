import "dotenv-safe/config";
import { DataSource } from "typeorm";
import { Subject } from "./entities/Subject";
import { CalendarEvent } from "./entities/CalendarEvent";
import { LessonTime } from "./entities/LessonTime";
import { Subtask } from "./entities/Subtask";
import { Task } from "./entities/Task";
import { User } from "./entities/User";
import { Lesson } from "./entities/Lesson";
import { Project } from "./entities/Project";
import { UserProject } from "./entities/UserProject";
import { ProjectTask } from "./entities/ProjectTask";
import { Reminder } from "./entities/Reminder";
import { Settings } from "./entities/Settings";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  // username: "postgres",
  // password: "postgres",
  // database: "schoolappEmpty",
  migrations: ["dist/migrations/*.ts"],

  logging: true,
  synchronize: false,
  entities: [
    User,
    Task,
    Subtask,
    Subject,
    CalendarEvent,
    LessonTime,
    Lesson,
    Project,
    UserProject,
    ProjectTask,
    Reminder,
    Settings,
  ],
});
