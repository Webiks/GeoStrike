import gql from 'graphql-tag';
import { playerFragment } from '../player.fragment';

export const notifyCrashMutation = gql`
  mutation notifyCrash($playerId: String!) {
    notifyCrash(playerId: $playerId) {
    ...PlayerFields
    }
  }
  ${playerFragment}
  `;
