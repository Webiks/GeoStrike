import gql from 'graphql-tag';

export const gameFragment = gql`
  fragment GameFields on Game {
    id
    gameCode
    state
    players {
      username
      character
      state
      isMe
      id
    }
  }
`;
