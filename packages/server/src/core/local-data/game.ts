import { v4 } from 'uuid';
import { sign } from 'jsonwebtoken';
import { GameState, PlayerState, PlayerSyncState } from '../../types';
import * as Cesium from 'cesium';
import { Settings } from '../../settings/settings';
import { startClientsUpdater } from '../clients-updater/clients-updater';
import { BackgroundCharacterManager } from '../background-character/background-character-manager';

export interface ICartesian3Location {
  x: number;
  y: number;
  z: number;
}

export enum Team {
  RED = 'RED',
  BLUE = 'BLUE',
  NONE = 'NONE',
}

export enum CharacterType {
  PLAYER = 'PLAYER',
  BACKGROUND_CHARACTER = 'BACKGROUND_CHARACTER',
  ADMIN_OVERVIEW = 'ADMIN_OVERVIEW',
}

export interface IPlayer {
  playerId: string;
  token: string;
  character: string;
  username: string;
  state: PlayerState;
  game: IGameObject;
  currentLocation: ICartesian3Location;
  heading: number;
  team: Team;
  syncState: PlayerSyncState;
  type: CharacterType;
}

export interface IGameObject {
  gameId: string;
  gameCode: string;
  playersMap: Map<string, IPlayer>;
  state: GameState;
  clientsUpdater?: any;
  bgCharactersManager: BackgroundCharacterManager;
}

const TOKENS_SECRET = 'sdf43tSWDG#%Tsdfw4';

const DEFAULT_PLAYERS_LOCATION = [
  { x: 1333422.9356770117, y: -4654805.289160995, z: 4137634.8619940765 },
  { x: 1333372.2794363261, y: -4654805.238712306, z: 4137651.1335756676 },
  { x: 1333427.435864061, y: -4654696.156980868, z: 4137755.369174167 },
  { x: 1333425.271653392, y: -4654860.0793055175, z: 4137572.887568583 },
];

export class GamesManager {
  private activeGames: Map<string, IGameObject> = new Map<string, IGameObject>();

  private generateGameCode(): string {
    const min = 1000;
    const max = 9999;
    let gameCode: string;

    do {
      gameCode = String(Math.floor(Math.random() * (max - min) + min));
    } while (this.activeGames.has(gameCode));

    return gameCode;
  }


  addPlayerToGame(gameId: string, player: IPlayer){
    const game = this.getGameById(gameId);
    const playerToAdd = {
      ...player,
      game,
    } as IPlayer;

    game.playersMap.set(player.playerId, playerToAdd);

    return player;
  }

  addRealPlayerToGame(gameId: string, character: string, username: string, team: Team): IPlayer {
    const game = this.getGameById(gameId);
    const playerId = v4();
    const playerToken = sign({
      gameId: game.gameId,
      playerId,
      username,
    }, TOKENS_SECRET);

    const player: IPlayer = {
      playerId,
      character,
      token: playerToken,
      username,
      state: 'WAITING',
      game,
      currentLocation: DEFAULT_PLAYERS_LOCATION[game.playersMap.size],
      heading: 0,
      team,
      type: CharacterType.PLAYER,
      syncState: 'VALID',
    };

    game.playersMap.set(playerId, player);

    return player;
  }

  createNewGame(): IGameObject {
    const gameId = v4();
    const gameCode = this.generateGameCode();

    const bgCharactersManager = new BackgroundCharacterManager(gameId, this);
    const gameObject: IGameObject = {
      gameId,
      gameCode,
      playersMap: new Map<string, IPlayer>(),
      state: 'WAITING',
      bgCharactersManager,
    };
    startClientsUpdater(gameObject);
    this.activeGames.set(gameId, gameObject);

    bgCharactersManager.initBgCharacters();
    bgCharactersManager.startCharactersMovement();

    return gameObject;
  }

  getGameById(id: string): IGameObject {
    if (this.activeGames.has(id)) {
      return this.activeGames.get(id);
    }

    throw new Error('Game does not exists');
  }

  getGameByCode(code: string): IGameObject {
    for (const [key, value] of this.activeGames.entries()) {
      if (value.gameCode === code) {
        return value;
      }
    }

    throw new Error('Game does not exists');
  }

  playerReady(gameId: string, playerId: string) {
    const game = this.getGameById(gameId);
    const player = game.playersMap.get(playerId);

    if (player) {
      player.state = 'READY';
    }
  }

  updatePlayerPosition(gameId: string, playerId: string, position: ICartesian3Location, heading: number) {
    const game = this.getGameById(gameId);
    const player = game.playersMap.get(playerId);
    if (player && position) {
      if (this.validatePlayerPosition(player.currentLocation, position)) {
        player.syncState = 'VALID';
        player.currentLocation = position;
        player.heading = heading;
      }
      else {
        player.syncState = 'INVALID';
      }
    }
  }

  updatePlayerState(gameId: string, playerId: string, newState: PlayerState) {
    const game = this.getGameById(gameId);
    const player = game.playersMap.get(playerId);
    if (player) {
      player.state = newState;
    }
  }

  validatePlayerPosition(currentLocation: ICartesian3Location, newLocation: ICartesian3Location): boolean {
    const currentPosition = new Cesium.Cartesian3(currentLocation.x, currentLocation.y, currentLocation.z);
    const newPosition = new Cesium.Cartesian3(newLocation.x, newLocation.y, newLocation.z);
    const distance = Cesium.Cartesian3.distance(currentPosition, newPosition);
    return distance < Settings.serverClientDistanceThreshold;
  }

  endGame(gameId: string){
    const game = this.getGameById(gameId);
    game.bgCharactersManager.stop();

    // TODO other end game logic...
  }
}
