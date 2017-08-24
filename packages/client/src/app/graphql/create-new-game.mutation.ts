import gql from 'graphql-tag';

export const createNewGameMutation = gql`
  mutation createNewGame($character: String!) {
    createNewGame(character: $character) {
      game {
        id
        gameCode
      }
      playerToken
    }
  }
`;
