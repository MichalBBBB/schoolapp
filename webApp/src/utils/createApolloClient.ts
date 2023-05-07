import { ApolloClient, InMemoryCache } from "@apollo/client";

const uri = "http://localhost:5002/graphql";
// const uri = "https://api.dayto.app/graphql";

export const createApolloClient = () => {
  const cache = new InMemoryCache();
  const client = new ApolloClient({
    cache,
    uri: uri,
  });
  return client;
};
