import gql from 'graphql-tag';

export const schema = gql`
  type Query {
    currentGame: Game
  }
`;
