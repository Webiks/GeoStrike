import gql from 'graphql-tag';
import { playerFragment } from './player.fragment';

export const updatePositionMutation = gql`
  mutation updatePosition($position: LocationInput!, $heading: Float!, $isCrawling: Boolean!, $isShooting: Boolean!, $isFlying: Boolean!, $isMoving: Boolean, $enteringBuildingPosition: LocationInput, $skipValidation: Boolean) {
    updatePosition (position: $position, heading: $heading, isCrawling: $isCrawling, isShooting: $isShooting, isFlying: $isFlying, isMoving: $isMoving, enteringBuildingPosition: $enteringBuildingPosition, skipValidation: $skipValidation) {
      ...PlayerFields
    }
  }

  ${playerFragment}
`;
