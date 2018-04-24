import gql from 'graphql-tag';
import { gameFragment } from '../game.fragment';

export const currentGameQuery = gql`
  query currentGame {
    currentGame {
      ...GameFields
    }
  }

  ${gameFragment}
`;
