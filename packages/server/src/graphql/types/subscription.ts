import gql from 'graphql-tag';

export const schema = gql`
  type Subscription {
    gameData: Game
  }
`;
