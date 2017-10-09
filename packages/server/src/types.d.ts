/* tslint:disable */

export interface User {
  id: string; 
  username: string | null; 
}

export interface Query {
  currentGame: Game | null; 
}

export interface Game {
  id: string; 
  players: Player[]; 
  gameCode: string; 
  state: GameState; 
  me: User | null; 
}

export interface Player extends User {
  id: string; 
  username: string | null; 
  character: CharacterData; 
  state: PlayerState; 
  isMe: boolean; 
  currentLocation: PlayerLocation; 
  team: Team; 
  syncState: PlayerSyncState; 
  type: CharacterType; 
}

export interface CharacterData {
  name: string; 
  model: string | null; 
  scale: number | null; 
  team: Team | null; 
  imageUrl: string | null; 
  description: string | null; 
  portraitUrl: string | null; 
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
  joinAsViewer: CreateOrJoinResult | null; 
  updatePosition: Player | null; 
  ready: Game | null; 
  notifyKill: Player | null; 
}

export interface CreateOrJoinResult {
  game: Game; 
  player: User; 
  playerToken: string; 
}

export interface Subscription {
  gameData: Game | null; 
}

export interface Viewer extends User {
  id: string; 
  username: string | null; 
}

export interface LocationInput {
  x: number; 
  y: number; 
  z: number; 
}
export interface CreateNewGameMutationArgs {
  character: string | null; 
  username: string; 
  team: Team; 
  isViewer: boolean; 
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

export type Team = "BLUE" | "RED" | "NONE";


export type PlayerState = "WAITING" | "READY" | "ALIVE" | "IN_BUILDING" | "DEAD";


export type PlayerSyncState = "VALID" | "INVALID";


export type CharacterType = "PLAYER" | "BACKGROUND_CHARACTER" | "OVERVIEW";


export type GameState = "WAITING" | "ACTIVE" | "DONE";

