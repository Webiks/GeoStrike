import gql from 'graphql-tag';

export const createNewGameMutation = gql`
  mutation createNewGame($character: String!, $username: String!) {
    createNewGame(character: $character, username: $username) {
      game {
        id
        gameCode
        players {
          username
          character
          id
        }
      }
      playerToken
    }
  }
`;
