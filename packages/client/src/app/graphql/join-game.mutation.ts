import gql from 'graphql-tag';

export const joinGameMutation = gql`
  mutation joinGame($gameCode: String!, $character: String!) {
    joinGame(character: $character, gameCode: $gameCode) {
      game {
        id
        gameCode
      }
      playerToken
    }
  }
`;
