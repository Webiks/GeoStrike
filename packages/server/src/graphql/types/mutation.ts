import gql from 'graphql-tag';

export const schema = gql`
  type Mutation {
    createNewGame(character: String!): CreateOrJoinResult
    joinGame(gameCode: String!, character: String!): CreateOrJoinResult
  }
`;
