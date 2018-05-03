import gql from 'graphql-tag';

export const schema = gql`
  type Mutation {
    createNewGame(character: String, username: String!, team: Team!, isViewer: Boolean!): CreateOrJoinResult
    joinGame(gameCode: String!, character: String!, username: String!, team: Team!): CreateOrJoinResult
    joinAsViewer(gameCode: String, username: String): CreateOrJoinResult
    updatePosition(position: LocationInput!, heading: Float!,isCrawling: Boolean!,isShooting: Boolean!, isFlying: Boolean!, isMoving: Boolean, enteringBuildingPosition: LocationInput , skipValidation: Boolean): Player
    ready: Game
    notifyKill(playerId: String!): Player
    notifyCrash(playerId: String!): Player
    notifyBeenShot(playerId: String!): Player
    notifyShot(byPlayerId: String!, shotPosition: LocationInput!): Boolean
    toggleFlightMode(playerId: String!, isFlying: Boolean!): Player
    takeControlOverPlayer(playerId: String!): Player
    removeControlOverPlayer: Player
  }
`;
