import gql from 'graphql-tag';
import { gameFragment } from './game.fragment';

export const changeTerrainTypeMutation = gql`
  mutation changeTerrainType($character: String ,$gameCode: String,$terrainType : String) {
    changeTerrainType(character: $character, gameCode: $gameCode, terrainType: $terrainType) {
      game {
        ...GameFields
      }
      playerToken
    }
  }

  ${gameFragment}
`;
