import gql from 'graphql-tag';

  export const beenShotSubscription = gql`
  subscription beenShots {
    beenShot {
      id
      lifeState
    }
  }
`;
