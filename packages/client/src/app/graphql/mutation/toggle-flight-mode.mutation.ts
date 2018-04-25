import gql from 'graphql-tag';
import { playerFragment } from '../player.fragment';

export const toggleFlightModeMutation = gql`
mutation toggleFlightMode($playerId: String!, $isFlying: Boolean!) {
    toggleFlightMode(playerId: $playerId, isFlying: $isFlying) {
      ...PlayerFields
    }
  }
  
  ${playerFragment}
`;
