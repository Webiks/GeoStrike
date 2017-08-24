import gql from 'graphql-tag';

export const schema = gql`
  type Mutation {
    createNewGame(character: String!, username: String!): CreateOrJoinResult
    joinGame(gameCode: String!, character: String!, username: String!): CreateOrJoinResult
  }
`;
