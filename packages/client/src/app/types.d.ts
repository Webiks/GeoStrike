
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
  lifeState: PlayerLifeState;
  lifeStatePerctange: number;
  isCrawling: boolean;
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
  notifyBeenShot?: Player;
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
  terrainType: string;
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

export type Team = "BLUE" | "RED" | "NONE";


export type PlayerState = "WAITING" | "READY" | "ALIVE" | "DEAD" | "CONTROLLED";


export type PlayerSyncState = "VALID" | "INVALID";


export type CharacterType = "PLAYER" | "BACKGROUND_CHARACTER" | "OVERVIEW";


export type GameState = "WAITING" | "ACTIVE" | "DONE";


export type PlayerLifeState = "FULL" | "HIGH" | "MEDIUM" | "LOW" | "EMPTY";

export namespace CreateNewGame {
  export type Variables = {
    character: string;
    username: string;
    team: Team;
    isViewer: boolean;
    terrainType: string;
  }

  export type Mutation = {
    createNewGame?: CreateNewGame;
  }

  export type CreateNewGame = {
    game: Game;
    playerToken: string;
  }

  export type Game = GameFields.Fragment
}

export namespace CurrentGame {
  export type Variables = {
  }

  export type Query = {
    currentGame?: CurrentGame;
  }

  export type CurrentGame = GameFields.Fragment
}
export namespace GameData {
  export type Variables = {
  }

  export type Subscription = {
    gameData?: GameData;
  }

  export type GameData = GameFields.Fragment
}
export namespace GameNotifications {
  export type Variables = {
  }

  export type Subscription = {
    gameNotifications?: GameNotifications;
  }

  export type GameNotifications = {
    message?: string;
  }
}
export namespace GunShots {
  export type Variables = {
  }

  export type Subscription = {
    gunShot?: GunShot;
  }

  export type GunShot = {
    id?: string;
    byPlayer?: ByPlayer;
    shotPosition?: ShotPosition;
  }

  export type ByPlayer = {
    id: string;
    username?: string;
  }

  export type ShotPosition = {
    x: number;
    y: number;
    z: number;
  }
}
export namespace JoinAsViewer {
  export type Variables = {
    gameCode?: string;
    username?: string;
  }

  export type Mutation = {
    joinAsViewer?: JoinAsViewer;
  }

  export type JoinAsViewer = {
    playerToken: string;
    game: Game;
  }

  export type Game = GameFields.Fragment
}
export namespace JoinGame {
  export type Variables = {
    gameCode: string;
    character: string;
    username: string;
    team: Team;
  }

  export type Mutation = {
    joinGame?: JoinGame;
  }

  export type JoinGame = {
    game: Game;
    playerToken: string;
  }

  export type Game = GameFields.Fragment
}
export namespace NotifyKill {
  export type Variables = {
    playerId: string;
  }

  export type Mutation = {
    notifyKill?: NotifyKill;
  }

  export type NotifyKill = PlayerFields.Fragment
}

export namespace NotifyBeenShot {
  export type Variables = {
    playerId: string;
  }

  export type Mutation = {
    notifyBeenShot?: NotifyBeenShot;
  }

  export type NotifyBeenShot = PlayerFields.Fragment
}

export namespace NotifyShot {
  export type Variables = {
    byPlayerId: string;
    shotPosition: LocationInput;
  }

  export type Mutation = {
    notifyShot?: boolean;
  }
}
export namespace Ready {
  export type Variables = {
  }

  export type Mutation = {
    ready?: Ready;
  }

  export type Ready = GameFields.Fragment
}
export namespace RemoveControl {
  export type Variables = {
  }

  export type Mutation = {
    removeControlOverPlayer?: RemoveControlOverPlayer;
  }

  export type RemoveControlOverPlayer = {
    id: string;
  }
}
export namespace TakeControl {
  export type Variables = {
    playerId: string;
  }

  export type Mutation = {
    takeControlOverPlayer?: TakeControlOverPlayer;
  }

  export type TakeControlOverPlayer = {
    id: string;
  }
}
export namespace UpdatePosition {
  export type Variables = {
    position: LocationInput;
    heading: number;
    isCrawling: boolean;
    isShooting: boolean;
    enteringBuildingPosition?: LocationInput;
    skipValidation?: boolean;
  }

  export type Mutation = {
    updatePosition?: UpdatePosition;
  }

  export type UpdatePosition = PlayerFields.Fragment
}

export namespace GameFields {
  export type Fragment = {
    id: string;
    gameCode: string;
    state: GameState;
    winingTeam?: Team;
    players: Players[];
    me?: Me;
    terrainType: string;
  }

  export type Players = {
    id: string;
    username?: string;
  } & PlayerFields.Fragment

  export type Me = PlayerFields.Fragment & ViewerFields.Fragment
}

export namespace PlayerFields {
  export type Fragment = {
    team: Team;
    syncState: PlayerSyncState;
    username?: string;
    character: Character;
    state: PlayerState;
    lifeState: PlayerLifeState;
    lifeStatePerctange: number;
    isCrawling: boolean;
    isShooting: boolean;
    isMe: boolean;
    id: string;
    type: CharacterType;
    currentLocation: CurrentLocation;
    enteringBuildingPosition?: EnteringBuildingPosition;
  }

  export type Character = {
    name: string;
    model?: string;
    scale?: number;
    portraitUrl?: string;
    iconUrl?: string;
    iconDeadUrl?: string;
    fixedHeight?: number;
  }

  export type CurrentLocation = LocationFields.Fragment

  export type EnteringBuildingPosition = LocationFields.Fragment
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

export namespace ViewerFields {
  export type Fragment = {
    username?: string;
    id: string;
  }
}
