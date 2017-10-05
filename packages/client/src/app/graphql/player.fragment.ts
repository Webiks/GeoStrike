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
    }
    state
    isMe
    id
    type 
    currentLocation {
      ...LocationFields
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
