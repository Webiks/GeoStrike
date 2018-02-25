import gql from 'graphql-tag';
import { playerFragment } from './player.fragment';

export const notifyBeenShotMutation = gql`
mutation notifyBeenShot($playerId: String!) {
    notifyBeenShot(playerId: $playerId) {
      ...PlayerFields
    }
  }
  
  ${playerFragment}
`;
