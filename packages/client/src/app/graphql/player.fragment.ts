import gql from 'graphql-tag';

export const playerFragment = gql`
  fragment PlayerFields on Player {
    team
    syncState
    username
    character
    state
    isMe
    id
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
