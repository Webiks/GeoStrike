/* tslint:disable */

export interface Query {
  currentGame: Game | null; 
}

export interface Game {
  id: string; 
  players: Player[]; 
  gameCode: string; 
  state: GameState; 
  me: Player | null; 
}

export interface Player {
  id: string; 
  username: string | null; 
  character: string; 
  state: PlayerState; 
  isMe: boolean; 
  currentLocation: PlayerLocation; 
  team: Team; 
  syncState: PlayerSyncState; 
  type: CharacterType; 
}

export interface PlayerLocation {
  location: Location; 
  heading: number; 
}

export interface Location {
  x: number; 
  y: number; 
  z: number; 
}

export interface Mutation {
  createNewGame: CreateOrJoinResult | null; 
  joinGame: CreateOrJoinResult | null; 
  joinAsViewer: ViewerJoinResult | null; 
  updatePosition: Player | null; 
  ready: Game | null; 
  notifyKill: Player | null; 
}

export interface CreateOrJoinResult {
  game: Game; 
  player: Player; 
  playerToken: string; 
}

export interface ViewerJoinResult {
  game: Game; 
  playerToken: string; 
}

export interface Subscription {
  gameData: Game | null; 
}

export interface LocationInput {
  x: number; 
  y: number; 
  z: number; 
}
export interface CreateNewGameMutationArgs {
  character: string; 
  username: string; 
  team: Team; 
}
export interface JoinGameMutationArgs {
  gameCode: string; 
  character: string; 
  username: string; 
  team: Team; 
}
export interface JoinAsViewerMutationArgs {
  gameCode: string | null; 
  username: string | null; 
}
export interface UpdatePositionMutationArgs {
  position: LocationInput; 
  heading: number; 
}
export interface NotifyKillMutationArgs {
  playerId: string; 
}

export type PlayerState = "WAITING" | "READY" | "ALIVE" | "IN_BUILDING" | "DEAD";


export type Team = "BLUE" | "RED" | "NONE";


export type PlayerSyncState = "VALID" | "INVALID";


export type CharacterType = "PLAYER" | "BACKGROUND_CHARACTER" | "ADMIN_OVERVIEW";


export type GameState = "WAITING" | "ACTIVE" | "DONE";

