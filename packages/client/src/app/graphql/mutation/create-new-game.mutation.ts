import gql from 'graphql-tag';
import { gameFragment } from '../game.fragment';

export const createNewGameMutation = gql`
  mutation createNewGame($character: String!, $username: String!, $team: Team!,$isViewer: Boolean!, $terrainType: String!) {
    createNewGame(character: $character, username: $username, team: $team, isViewer: $isViewer, terrainType: $terrainType) {
      game {
        ...GameFields
      }
      playerToken
    }
  }

  ${gameFragment}
`;
