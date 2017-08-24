import gql from 'graphql-tag';

export const schema = gql`
  type Mutation {
    createNewGame: Game
    joinGame(gameCode: String!): Game
  }
`;
