import gql from 'graphql-tag';
import { gameFragment } from './game.fragment';

export const updatePositionMutation = gql`
  mutation updatePosition($position: LocationInput!) {
    updatePosition (position: $position) {
      ...PlayerFields
    }
  }

  ${gameFragment}
`;
