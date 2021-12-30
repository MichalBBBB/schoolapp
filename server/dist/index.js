"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const constants_1 = require("./utils/constants");
const apollo_server_core_1 = require("apollo-server-core");
const hello_1 = require("./resolvers/hello");
const main = async () => {
    await (0, typeorm_1.createConnection)({
        type: "postgres",
        username: "postgres",
        password: "postgres",
        database: "schoolapp",
        logging: true,
        synchronize: true,
        entities: [],
    });
    const app = (0, express_1.default)();
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: await (0, type_graphql_1.buildSchema)({
            resolvers: [hello_1.HelloResolver],
        }),
        plugins: [
            constants_1.__prod__
                ? (0, apollo_server_core_1.ApolloServerPluginLandingPageDisabled)()
                : (0, apollo_server_core_1.ApolloServerPluginLandingPageGraphQLPlayground)(),
        ],
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({ app });
    app.listen(5002, () => {
        console.log("Server running");
    });
};
main().catch((error) => console.log(error));
//# sourceMappingURL=index.js.map