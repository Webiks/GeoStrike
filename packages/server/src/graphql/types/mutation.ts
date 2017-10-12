import gql from 'graphql-tag';

export const schema = gql`
  type Mutation {
    createNewGame(character: String, username: String!, team: Team!, isViewer: Boolean!): CreateOrJoinResult
    joinGame(gameCode: String!, character: String!, username: String!, team: Team!): CreateOrJoinResult
    joinAsViewer(gameCode: String, username: String): CreateOrJoinResult
    updatePosition(position: LocationInput!, heading: Float!,isCrawling: Boolean!, skipValidation: Boolean): Player
    ready: Game
    notifyKill(playerId: String!): Player
    takeControlOverPlayer(playerId: String!): Player
    removeControlOverPlayer: Player
  }
`;
