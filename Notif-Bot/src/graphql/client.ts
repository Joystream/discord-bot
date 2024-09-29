import { GraphQLClient } from "graphql-request";

export const graphqlClient = new GraphQLClient(
  "https://query.joystream.org/graphql"
);
