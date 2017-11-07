import gql from 'graphql-tag';

export const gunShotSubscription = gql`
  subscription gunShots {
    gunShot {
      byPlayer {
        id
        username
      }
      shotPosition {
        x
        y
        z
      }
    }
  }
`;
