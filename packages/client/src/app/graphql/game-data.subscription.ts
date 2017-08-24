import gql from 'graphql-tag';

export const gameDataSubscription = gql`
  subscription gameData {
    gameData {
      id
      gameCode
      state
      players {
        id
        username
        character
      }
    }
  }
`;
