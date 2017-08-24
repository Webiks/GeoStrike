/* tslint:disable */

export interface Query {
  game: Game | null; 
}

export interface Game {
  id: string; 
  players: Player[]; 
  gameCode: string; 
  state: GameState; 
}

export interface Player {
  id: string; 
  username: string; 
  character: string; 
}

export interface Mutation {
  createNewGame: CreateOrJoinResult | null; 
  joinGame: CreateOrJoinResult | null; 
}

export interface CreateOrJoinResult {
  game: Game; 
  player: Player; 
  playerToken: string; 
}

export interface Subscription {
  gameData: Game | null; 
}
export interface GameQueryArgs {
  gameId: string; 
  gameCode: string; 
}
export interface CreateNewGameMutationArgs {
  character: string; 
  username: string; 
}
export interface JoinGameMutationArgs {
  gameCode: string; 
  character: string; 
  username: string; 
}

export type GameState = "WAITING" | "ACTIVE" | "DONE";

