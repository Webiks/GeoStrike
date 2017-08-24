import { ApolloClient, createNetworkInterface } from 'apollo-client';
import { AuthorizationMiddleware } from './authorization-middleware';

const networkInterface = createNetworkInterface({
  uri: 'http://localhost:3000/graphql'
});

networkInterface.use([new AuthorizationMiddleware()]);

const apolloClient = new ApolloClient({
  networkInterface,
});

export function getApolloClient() {
  return apolloClient;
}
