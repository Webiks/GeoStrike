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
    lifeState
    lifeStatePerctange
    isCrawling
    isShooting
    isFlying
    isMoving
    flight {
      speed
      minHeight
      remainingTime
      maxHeight
      heightLevel
    }
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
