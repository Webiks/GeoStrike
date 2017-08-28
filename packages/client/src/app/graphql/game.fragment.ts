import gql from 'graphql-tag';
import { playerFragment } from './player.fragment';

export const gameFragment = gql`
  fragment GameFields on Game {
    id
    gameCode
    state
    players {
      ...PlayerFields
    }
    me {
      ...PlayerFields
    }
  }
  
  ${playerFragment}
`;
