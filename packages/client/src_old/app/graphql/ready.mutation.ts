import gql from 'graphql-tag';
import { gameFragment } from './game.fragment';

export const readyMutation = gql`
  mutation ready {
    ready {
      ...GameFields
    }
  }

  ${gameFragment}
`;
