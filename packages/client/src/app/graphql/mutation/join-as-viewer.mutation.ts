import gql from 'graphql-tag';
import { gameFragment } from '../game.fragment';

export const joinAsViewer = gql`
  mutation joinAsViewer($gameCode: String, $username: String){
    joinAsViewer(gameCode: $gameCode,username: $username){
      playerToken
      game {
        ...GameFields
      }
    }
  }
  
  ${gameFragment}
`;
