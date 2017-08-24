import gql from 'graphql-tag';

export const schema = gql`
  type Player {
    id: String!
    username: String!
    character: String!
    state: PlayerState!
    isMe: Boolean
  }

  enum PlayerState {
    WAITING,
    READY,
    ALIVE,
    IN_BUILDING,
    DEAD,
  }
`;
