import gql from 'graphql-tag';

export const schema = gql`
  type Game {
    id: String!
    players: [Player!]
    gameCode: String!
    userToken: String!
  }
`;
