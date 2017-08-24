import gql from 'graphql-tag';

export const schema = gql`
  type Game {
    id: String!
    players: [Player!]
    gameCode: String!
    userToken: String!
  }

  type CreateOrJoinResult {
    game: Game!
    playerToken: String!
  }
`;
