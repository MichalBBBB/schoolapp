import "dotenv/config";
import { createConnection } from "typeorm";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { __prod__ } from "./utils/constants";
import {
  ApolloServerPluginLandingPageDisabled,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from "apollo-server-core";
import { HelloResolver } from "./resolvers/hello";
import { verify } from "jsonwebtoken";
import { User } from "./entities/User";
import {
  createAccesToken,
  createRefreshToken,
  RefreshTokenPayload,
  sendRefreshToken,
} from "./utils/authUtils";
import { Task } from "./entities/Task";
import { userResolver } from "./resolvers/userResolver";
import cookieParser from "cookie-parser";
import { taskResolver } from "./resolvers/taskResolver";
import { Subtask } from "./entities/Subtask";
import { Subject } from "./entities/Subject";
import { subtaskResolver } from "./resolvers/subtaskResolver";
import { subjectResolver } from "./resolvers/subjectResolver";

const main = async () => {
  // Initialize typeorm connection
  await createConnection({
    type: "postgres",
    username: "postgres",
    password: "postgres",
    database: "schoolapp",
    logging: true,
    synchronize: true,
    entities: [User, Task, Subtask, Subject],
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

      const user = await User.findOne({ id: payload.userId });

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
      ],
    }),
    plugins: [
      __prod__
        ? ApolloServerPluginLandingPageDisabled()
        : ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
    context: ({ req, res }) => ({ req, res }),
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({ app });

  app.listen(5002, () => {
    console.log("Server running");
  });
};

main().catch((error) => console.log(error));
