import gql from 'graphql-tag';

export const schema = gql`
  type Mutation {
    createNewGame(character: String!, username: String!, team: Team!): CreateOrJoinResult
    joinGame(gameCode: String!, character: String!, username: String!, team: Team!): CreateOrJoinResult
    updatePosition(position: LocationInput!, heading: Float!): Player
    ready: Game
    notifyKill(playerId: String!): Player
  }
`;
