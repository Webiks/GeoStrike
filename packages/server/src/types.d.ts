/* tslint:disable */

export interface User {
  id: string; 
  username?: string; 
}

export interface Query {
  currentGame?: Game; 
}

export interface Game {
  id: string; 
  players: Player[]; 
  gameCode: string; 
  state: GameState; 
  me?: User; 
  winingTeam?: Team; 
}

export interface Player extends User {
  id: string; 
  username?: string; 
  character: CharacterData; 
  state: PlayerState; 
  isCrawling: boolean; 
  isMe: boolean; 
  currentLocation: PlayerLocation; 
  team: Team; 
  syncState: PlayerSyncState; 
  type: CharacterType; 
}

export interface CharacterData {
  name: string; 
  model?: string; 
  scale?: number; 
  team?: Team; 
  imageUrl?: string; 
  description?: string; 
  portraitUrl?: string; 
  iconUrl?: string; 
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
  createNewGame?: CreateOrJoinResult; 
  joinGame?: CreateOrJoinResult; 
  joinAsViewer?: CreateOrJoinResult; 
  updatePosition?: Player; 
  ready?: Game; 
  notifyKill?: Player; 
  takeControlOverPlayer?: Player; 
  removeControlOverPlayer?: Player; 
}

export interface CreateOrJoinResult {
  game: Game; 
  player: User; 
  playerToken: string; 
}

export interface Subscription {
  gameData?: Game; 
}

export interface Viewer extends User {
  id: string; 
  username?: string; 
}

export interface LocationInput {
  x: number; 
  y: number; 
  z: number; 
}
export interface CreateNewGameMutationArgs {
  character?: string; 
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
  gameCode?: string; 
  username?: string; 
}
export interface UpdatePositionMutationArgs {
  position: LocationInput; 
  heading: number; 
  isCrawling: boolean; 
  skipValidation?: boolean; 
}
export interface NotifyKillMutationArgs {
  playerId: string; 
}
export interface TakeControlOverPlayerMutationArgs {
  playerId: string; 
}

export type Team = "BLUE" | "RED" | "NONE";


export type PlayerState = "WAITING" | "READY" | "ALIVE" | "IN_BUILDING" | "DEAD" | "CONTROLLED";


export type PlayerSyncState = "VALID" | "INVALID";


export type CharacterType = "PLAYER" | "BACKGROUND_CHARACTER" | "OVERVIEW";


export type GameState = "WAITING" | "ACTIVE" | "DONE";

