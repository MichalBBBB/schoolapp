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

const main = async () => {
  await createConnection({
    type: "postgres",
    username: "postgres",
    password: "postgres",
    database: "schoolapp",
    logging: true,
    synchronize: true,
    entities: [],
  });

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver],
    }),
    plugins: [
      __prod__
        ? ApolloServerPluginLandingPageDisabled()
        : ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
  });
  await apolloServer.start();

  apolloServer.applyMiddleware({ app });

  app.listen(5002, () => {
    console.log("Server running");
  });
};

main().catch((error) => console.log(error));
