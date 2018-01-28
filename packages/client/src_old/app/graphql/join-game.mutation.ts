import gql from 'graphql-tag';
import { gameFragment } from './game.fragment';

export const joinGameMutation = gql`
  mutation joinGame($gameCode: String!, $character: String!, $username: String!, $team: Team!) {
    joinGame(character: $character, gameCode: $gameCode, username: $username, team: $team) {
      game {
        ...GameFields
      }
      playerToken
    }
  }

  ${gameFragment}
`;
