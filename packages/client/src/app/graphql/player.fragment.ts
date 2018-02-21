import gql from 'graphql-tag';

export const playerFragment = gql`
  fragment PlayerFields on Player {
    team
    syncState
    username
    character {
      name
      model
      scale
      portraitUrl
      iconUrl
      iconDeadUrl
      fixedHeight
    }
    state
    isCrawling
    isFlying
    flight {
      speed
      height
      remainingTime
    }
    isShooting
    isMe
    id
    type
    currentLocation {
      ...LocationFields
    }
    enteringBuildingPosition {
      x
      y
      z
    }
  }

  fragment LocationFields on PlayerLocation {
    location {
      x
      y
      z
    }
    heading
  }
`;
