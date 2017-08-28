import gql from 'graphql-tag';
import { playerFragment } from './player.fragment';

export const updatePositionMutation = gql`
  mutation updatePosition($position: LocationInput!, $heading: Float!) {
    updatePosition (position: $position, heading: $heading) {
      ...PlayerFields
    }
  }

  ${playerFragment}
`;
