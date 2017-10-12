import gql from 'graphql-tag';

export const schema = gql`
  type Notification {
    gameId: String
    message: String
  }
`;
