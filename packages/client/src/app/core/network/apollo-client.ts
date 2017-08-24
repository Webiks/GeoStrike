import { ApolloClient } from 'apollo-client';
import { client } from './websocket';

const apolloClient = new ApolloClient({
  networkInterface: client,
});

export function getApolloClient() {
  return apolloClient;
}
