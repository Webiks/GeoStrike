import gql from 'graphql-tag';

export const schema = gql`
  type Query {
    game(gameId: String!, gameCode: String!): Game
  }
`;
