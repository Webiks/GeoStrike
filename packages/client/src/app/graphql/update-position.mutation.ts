import gql from 'graphql-tag';
import { playerFragment } from './player.fragment';

export const updatePositionMutation = gql`
  mutation updatePosition($position: LocationInput!, $heading: Float!, $isCrawling: Boolean!, $isShooting: Boolean!, $skipValidation: Boolean) {
    updatePosition (position: $position, heading: $heading, isCrawling: $isCrawling, isShooting: $isShooting, skipValidation: $skipValidation) {
      ...PlayerFields
    }
  }

  ${playerFragment}
`;
