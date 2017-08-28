import gql from 'graphql-tag';

export const gameFragment = gql`
  fragment GameFields on Game {
    id
    gameCode
    state
    players {
      ...PlayerFields
    }
    me {
      ...PlayerFields
    }
  }

  fragment PlayerFields on Player {
    team
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
