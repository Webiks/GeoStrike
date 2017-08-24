import gql from 'graphql-tag';
import { gameFragment } from './game.fragment';

export const createNewGameMutation = gql`
  mutation createNewGame($character: String!, $username: String!) {
    createNewGame(character: $character, username: $username) {
      game {
        ...GameFields
      }
      playerToken
    }
  }

  ${gameFragment}
`;
