import gql from 'graphql-tag';
import { gameFragment } from './game.fragment';

export const createNewGameMutation = gql`
  mutation createNewGame($character: String!, $username: String!, $team: Team!) {
    createNewGame(character: $character, username: $username, team: $team) {
      game {
        ...GameFields
      }
      playerToken
    }
  }

  ${gameFragment}
`;
