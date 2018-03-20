import gql from 'graphql-tag';
import { gameFragment } from './game.fragment';

export const changeTerrainTypeMutation = gql`
  mutation changeTerrainType($character: String!,$gameCode: String,$terrainType : !string) {
    changeTerrainType(terrainType: $terrainType, gameCode: $gameCode,character: $character) {
      game {
        ...GameFields
      }
      playerToken
    }
  }

  ${gameFragment}
`;
