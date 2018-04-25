import gql from 'graphql-tag';
import { gameFragment } from '../game.fragment';

export const gameDataSubscription = gql`
  subscription gameData {
    gameData {
      ...GameFields
    }
  }

  ${gameFragment}
`;
