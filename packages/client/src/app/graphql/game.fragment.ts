import gql from 'graphql-tag';
import { playerFragment } from './player.fragment';
import { viewerFields } from './viewer.fragment';

export const gameFragment = gql`
  fragment GameFields on Game {
    id
    gameCode
    state
    winingTeam
    players {
      id
      username
      ...PlayerFields
    }
    me {
      __typename
      ...PlayerFields
      ...ViewerFields
    }
  }
  
  ${playerFragment}
  ${viewerFields}
`;
