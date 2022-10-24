import "dotenv/config";
import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
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

  const app = express();

  app.use(cookieParser());

  // The refresh token rest endpoint to return an accesToken
  app.post("/refresh_token", async (req, res) => {
    const token = req.cookies.jid;
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

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        HelloResolver,
        userResolver,
        taskResolver,
        subtaskResolver,
        subjectResolver,
        calendarEventResolver,
        lessonTimeResolver,
      ],
    }),
    context: ({ req, res }) => ({ req, res }),
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({ app });

  app.listen(5002, () => {
    console.log("Server running");
  });
};

main().catch((error) => console.log(error));
