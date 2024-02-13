import "dotenv-safe/config";
import "reflect-metadata";
import express from "express";
import { buildSchema } from "type-graphql";
import { __prod__ } from "./utils/constants";
import { HelloResolver } from "./resolvers/hello";
import { verify } from "jsonwebtoken";
import { User } from "./entities/User";
import {
  createAccesToken,
  createRefreshToken,
  RefreshTokenPayload,
  sendRefreshToken,
} from "./utils/authUtils";
import { userResolver } from "./resolvers/userResolver";
import cookieParser from "cookie-parser";
import { taskResolver } from "./resolvers/taskResolver";
import { subtaskResolver } from "./resolvers/subtaskResolver";
import { subjectResolver } from "./resolvers/subjectResolver";
import { calendarEventResolver } from "./resolvers/calendarEventResolver";
import { lessonTimeResolver } from "./resolvers/lessonTimeResolver";
import { AppDataSource } from "./TypeORM";
import { lessonResolver } from "./resolvers/lessonResolver";
import { projectResolver } from "./resolvers/projectResolver";
import { projectTaskResolver } from "./resolvers/projectTaskResolver";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import { json } from "body-parser";
import { DefferedObject } from "./middleware/queueMiddleware";
import { reminderResolver } from "./resolvers/reminderResolver";
import { settingsResolver } from "./resolvers/settingsResolver";
import { createClient } from "redis";
import { MyContext } from "./utils/MyContext";
import { Schedule } from "./entities/Schedule";
import { LessonTime } from "./entities/LessonTime";
import { ScheduleResolver } from "./resolvers/scheduleResolver";
import appleSignin from "apple-signin-auth";
import admin from "firebase-admin";
import { applicationDefault } from "firebase-admin/app";
export type UserQueueObject = {
  resolveObject: DefferedObject;
  req: any;
};

export const queueMap = new Map<string, Array<UserQueueObject>>();

const main = async () => {
  // Initialize typeorm connection
  await AppDataSource.initialize()
    .then(() => {
      console.log("Data source has been initialized");
    })
    .catch((err) => {
      console.log("Error during Data Source initialization", err);
    });
  //User.delete({});
  //Task.delete({});
  await AppDataSource.runMigrations();
  // Only keep this in this one version to change the data in the database
  const schedules = await Schedule.find();
  if (schedules.length == 0) {
    const users = await User.find();
    for (const user of users) {
      const schedule = Schedule.create({
        name: "Default",
        userId: user.id,
        default: true,
      });
      const lessonTimes = await LessonTime.find({ where: { userId: user.id } });
      schedule.lessonTimes = lessonTimes;
      await schedule.save();
    }
  }

  const redis = createClient({
    url: process.env.REDIS_URL,
  });

  redis.on("error", (err) => console.log("Redis Client Error", err));

  await redis.connect().catch((err) => {
    console.log("redis error", err);
  });

  const app = express();

  app.set("proxy", 1);

  app.use(cookieParser());

  // The refresh token rest endpoint to return an accesToken
  app.post("/refresh_token", async (req, res) => {
    console.log("request");
    const token = req.cookies.jid;
    console.log("cookies", req.cookies);
    if (!token) {
      return res.send({
        ok: false,
        accesToken: "",
        message: "refresh token not found",
      });
    }

    try {
      // Checking whether refresh token has a valid signature
      const payload = verify(
        token,
        process.env.REFRESH_TOKEN_SECRET!
      ) as RefreshTokenPayload;

      const user = await User.findOne({ where: { id: payload.userId } });

      if (!user) {
        return res.send({
          ok: false,
          accesToken: "",
          message: "User doesn't exist",
        });
      }
      // Checking whether version of token is equal to latest version of token for the user
      // If tokenVersion version of user is higher, it was manually changed to revoke acces from existing refresh tokens
      if (user.tokenVersion !== payload.tokenVersion) {
        return res.send({ ok: false, accesToken: "" });
      }

      sendRefreshToken(res, createRefreshToken(user));
      return res.send({ ok: true, accesToken: createAccesToken(user) });
    } catch (err) {
      return res.send({ ok: false, accesToken: "" });
    }
  });

  app.get("/apple-signin-webhook", async (req, _) => {
    const { events } = await appleSignin.verifyWebhookToken(req.body.payload, {
      audience: "app.dayto.dayto",
    });
    const { sub: userAppleId, type, email } = events;
    const user = await User.findOne({ where: { appleIdToken: userAppleId } });
    if (user) {
      switch (type) {
        case "email-disabled":
          if (email) {
            user.email = email;
            await user.save();
          }
          break;
        case "email-enabled":
          if (email) {
            user.email = email;
            await user.save();
          }
          break;
        case "consent-revoked":
          break;
        case "account-delete":
          await user;
          break;
      }
    }
  });

  const apolloServer = new ApolloServer({
    allowBatchedHttpRequests: true,
    schema: await buildSchema({
      resolvers: [
        HelloResolver,
        userResolver,
        taskResolver,
        subtaskResolver,
        subjectResolver,
        calendarEventResolver,
        lessonTimeResolver,
        lessonResolver,
        projectResolver,
        projectTaskResolver,
        reminderResolver,
        settingsResolver,
        ScheduleResolver,
      ],
    }),
  });

  await apolloServer.start();

  admin.initializeApp({
    credential: applicationDefault(),
  });
  // send a refresh notification every hour to every device
  setInterval(() => {
    admin.messaging().send({
      topic: "refresh",
      data: {
        action: "refresh",
      },
      apns: {
        headers: {
          "apns-push-type": "background",
          "apns-priority": "5",
          "apns-topic": "app.dayto.dayto",
        },
        payload: {
          aps: {
            contentAvailable: true,
          },
        },
      },
      android: {
        priority: "high",
      },
    });
  }, 60 * 60 * 1000);

  app.use(
    "/graphql",
    cors<cors.CorsRequest>(),
    json(),
    expressMiddleware(apolloServer, {
      context: async ({ res, req }) => ({ res, req, redis } as MyContext),
    })
  );

  app.get("/check", (_req, res) => {
    res.json({ minVersion: "1.0.4" });
  });

  app.listen(process.env.PORT, () => {
    console.log("Server running");
  });
};

main().catch((error) => console.log(error));
