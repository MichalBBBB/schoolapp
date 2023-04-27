import { ApolloClient, InMemoryCache } from "@apollo/client";

export const createApolloClient = () => {
  const cache = new InMemoryCache();
  const client = new ApolloClient({
    cache,
    uri: "http://localhost:5002/graphql",
  });
  return client;
};
