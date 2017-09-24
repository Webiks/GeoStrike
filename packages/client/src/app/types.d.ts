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
  updatePosition: Player | null; 
  ready: Game | null; 
  notifyKill: Player | null; 
}

export interface CreateOrJoinResult {
  game: Game; 
  player: Player; 
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

export namespace CreateNewGame {
  export type Variables = {
    character: string;
    username: string;
    team: Team;
  }

  export type Mutation = {
    createNewGame: CreateNewGame | null; 
  }

  export type CreateNewGame = {
    game: Game; 
    playerToken: string; 
  }

  export type Game = {
  } & GameFields.Fragment
}
export namespace CurrentGame {
  export type Variables = {
  }

  export type Query = {
    currentGame: CurrentGame | null; 
  }

  export type CurrentGame = {
  } & GameFields.Fragment
}
export namespace GameData {
  export type Variables = {
  }

  export type Subscription = {
    gameData: GameData | null; 
  }

  export type GameData = {
  } & GameFields.Fragment
}
export namespace JoinGame {
  export type Variables = {
    gameCode: string;
    character: string;
    username: string;
    team: Team;
  }

  export type Mutation = {
    joinGame: JoinGame | null; 
  }

  export type JoinGame = {
    game: Game; 
    playerToken: string; 
  }

  export type Game = {
  } & GameFields.Fragment
}
export namespace NotifyKill {
  export type Variables = {
    playerId: string;
  }

  export type Mutation = {
    notifyKill: NotifyKill | null; 
  }

  export type NotifyKill = {
  } & PlayerFields.Fragment
}
export namespace Ready {
  export type Variables = {
  }

  export type Mutation = {
    ready: Ready | null; 
  }

  export type Ready = {
  } & GameFields.Fragment
}
export namespace UpdatePosition {
  export type Variables = {
    position: LocationInput;
    heading: number;
  }

  export type Mutation = {
    updatePosition: UpdatePosition | null; 
  }

  export type UpdatePosition = {
  } & PlayerFields.Fragment
}

export namespace GameFields {
  export type Fragment = {
    id: string; 
    gameCode: string; 
    state: GameState; 
    players: Players[]; 
    me: Me | null; 
  }

  export type Players = {
  } & PlayerFields.Fragment

  export type Me = {
  } & PlayerFields.Fragment
}

export namespace PlayerFields {
  export type Fragment = {
    team: Team; 
    syncState: PlayerSyncState; 
    username: string | null; 
    character: string; 
    state: PlayerState; 
    isMe: boolean; 
    id: string; 
    type: CharacterType; 
    currentLocation: CurrentLocation; 
  }

  export type CurrentLocation = {
  } & LocationFields.Fragment
}

export namespace LocationFields {
  export type Fragment = {
    location: Location; 
    heading: number; 
  }

  export type Location = {
    x: number; 
    y: number; 
    z: number; 
  }
}
