import gql from 'graphql-tag';

export const joinGameMutation = gql`
  mutation joinGame($gameCode: String!, $character: String!, $username: String!) {
    joinGame(character: $character, gameCode: $gameCode, username: $username) {
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
