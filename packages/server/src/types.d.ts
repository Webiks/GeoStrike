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
  isFlying: boolean;
  flight:FlightData;
  isShooting: boolean; 
  isMe: boolean; 
  currentLocation: PlayerLocation; 
  team: Team; 
  syncState: PlayerSyncState; 
  type: CharacterType; 
  enteringBuildingPosition?: PlayerLocation; 
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
  iconDeadUrl?: string; 
  fixedHeight?: number; 
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
  notifyShot?: boolean; 
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
  gameNotifications?: Notification; 
  gunShot?: ShotData; 
}

export interface Notification {
  gameId?: string; 
  message?: string; 
}

export interface ShotData {
  id?: string; 
  byPlayer?: Player; 
  shotPosition?: Location; 
  time?: number; 
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
  isShooting: boolean; 
  enteringBuildingPosition?: LocationInput; 
  skipValidation?: boolean; 
}
export interface NotifyKillMutationArgs {
  playerId: string; 
}
export interface NotifyShotMutationArgs {
  byPlayerId: string; 
  shotPosition: LocationInput; 
}
export interface TakeControlOverPlayerMutationArgs {
  playerId: string; 
}

export interface FlightData {
  remainingTime: number;
  speed: FlightSpeed;
  height: FlightHeight;
}

export type FlightSpeed = "NONE" | "MIN" | "MAX";

export type FlightHeight = "NONE" | "A" | "B" | "C" | "D" | "E"| "MAX"

export type Team = "BLUE" | "RED" | "NONE";


export type PlayerState = "WAITING" | "READY" | "ALIVE" | "DEAD" | "CONTROLLED";


export type PlayerSyncState = "VALID" | "INVALID";


export type CharacterType = "PLAYER" | "BACKGROUND_CHARACTER" | "OVERVIEW";


export type GameState = "WAITING" | "ACTIVE" | "DONE";

