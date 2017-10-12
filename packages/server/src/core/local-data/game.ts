import { v4 } from 'uuid';
import { sign } from 'jsonwebtoken';
import { CharacterData, GameState, PlayerState, PlayerSyncState } from '../../types';
import * as Cesium from 'cesium';
import { config } from '../../settings/config';
import { startClientsUpdater, stopClientsUpdater } from '../clients-updater/clients-updater';
import { BackgroundCharacterManager } from '../background-character/background-character-manager';
import { PLAYER_CHARACTERS } from './characters';
import Timer = NodeJS.Timer;

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
  OVERVIEW = 'OVERVIEW',
}

export interface IViewer {
  token: string;
  playerId: string;
  username: string;
}

export interface IPlayer {
  playerId: string;
  token: string;
  character: CharacterData;
  username: string;
  state: PlayerState;
  isCrawling: boolean;
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
  viewers: IViewer[];
  state: GameState;
  clientsUpdaterId?: Timer;
  bgCharactersManager: BackgroundCharacterManager;
  winingTeam: Team,
  controlledPlayersMap: Map<string, IPlayer>
}

const TOKENS_SECRET = 'sdf43tSWDG#%Tsdfw4';

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

  addPlayerToGame(gameId: string, player: IPlayer) {
    const game = this.getGameById(gameId);
    const playerToAdd = {
      ...player,
      game,
    } as IPlayer;

    game.playersMap.set(player.playerId, playerToAdd);

    return player;
  }

  addViewerToGame(gameId: string, username: string): IViewer {
    const game = this.getGameById(gameId);
    const playerId = v4();
    const playerToken = sign(
      {
        gameId: game.gameId,
        playerId,
        username,
      },
      TOKENS_SECRET
    );

    const viewer = {
      token: playerToken,
      playerId,
      username,
    };
    game.viewers.push(viewer);
    return viewer;
  }

  addRealPlayerToGame(gameId: string,
                      characterName: string,
                      username: string,
                      team: Team): IPlayer {
    const game = this.getGameById(gameId);
    const playerId = v4();
    const playerToken = sign(
      {
        gameId: game.gameId,
        playerId,
        username,
      },
      TOKENS_SECRET
    );

    const realPlayerCount = Array.from(game.playersMap.values()).filter(
      p => p.type === CharacterType.PLAYER
    ).length;

    const character = PLAYER_CHARACTERS.find(p => p.name === characterName);
    const player: IPlayer = {
      playerId,
      character,
      token: playerToken,
      username,
      state: 'WAITING',
      game,
      currentLocation: config.PLAYERS_SPAWN_POSITIONS[realPlayerCount],
      heading: 0,
      team,
      type: CharacterType.PLAYER,
      isCrawling: false,
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
      viewers: [],
      winingTeam: Team.NONE,
      controlledPlayersMap: new Map<string, IPlayer>(),
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

  updatePlayerPosition(gameId: string,
                       playerId: string,
                       position: ICartesian3Location,
                       heading: number,
                       isCrawling: boolean,
                       skipValidation = false) {
    const game = this.getGameById(gameId);
    const player = game.playersMap.get(playerId);
    if (player && position) {
      if (
        skipValidation ||
        this.validatePlayerPosition(player.currentLocation, position)
      ) {
        player.syncState = 'VALID';
        player.currentLocation = position;
        player.heading = heading;
        player.isCrawling = isCrawling;
      } else {
        player.syncState = 'INVALID';
      }

      return player;
    }

    return null;
  }

  updatePlayerState(gameId: string, playerId: string, newState: PlayerState) {
    const game = this.getGameById(gameId);
    const player = game.controlledPlayersMap.get(playerId) || game.playersMap.get(playerId);
    if (player) {
      player.state = newState;
    }

    this.checkGameResult(game);

  }

  private checkGameResult(game: IGameObject) {
    const players = Array.from(game.playersMap.values());

    const bluePlayers = players.filter(p => p.team === Team.BLUE);
    const deadBlues = bluePlayers.filter(p => p.state === 'DEAD').length;
    const bluePlayersCount = bluePlayers.length;

    const redPlayers = players.filter(p => p.team === Team.RED);
    const deadReds = redPlayers.filter(p => p.state === 'DEAD').length;
    const redPlayersCount = redPlayers.length;

    let winingTeam = null;
    if (bluePlayersCount && deadBlues === bluePlayersCount) {
      winingTeam = Team.RED;
    } else if (redPlayersCount && deadReds === redPlayersCount) {
      winingTeam = Team.BLUE;
    }

    if (winingTeam) {
      game.winingTeam = winingTeam;
      setTimeout(() => this.endGame(game.gameId), config.clientsUpdateRate * 10);
    }
  }

  validatePlayerPosition(currentLocation: ICartesian3Location,
                         newLocation: ICartesian3Location): boolean {
    const currentPosition = new Cesium.Cartesian3(
      currentLocation.x,
      currentLocation.y,
      currentLocation.z
    );
    const newPosition = new Cesium.Cartesian3(
      newLocation.x,
      newLocation.y,
      newLocation.z
    );
    const distance = Cesium.Cartesian3.distance(currentPosition, newPosition);
    return distance < config.serverClientDistanceThreshold;
  }

  endGame(gameId: string) {
    const game = this.getGameById(gameId);
    game.bgCharactersManager.stop();
    stopClientsUpdater(game);
    this.activeGames.delete(gameId);
  }

  takeControlOverPlayer(game, playerId: string, controlledPlayerId: string): IPlayer {
    const controlledPlayer = game.playersMap.get(controlledPlayerId);
    game.controlledPlayersMap.set(playerId, controlledPlayer);
    return controlledPlayer;
  }

  removeControlOverPlayer(game, playerId: string): IPlayer {
    const controlledPlayer = game.controlledPlayersMap.get(playerId);
    game.controlledPlayersMap.delete(playerId);
    return controlledPlayer;
  }

  isControlled(game: IGameObject, playerId): boolean {
    return !!Array.from(game.controlledPlayersMap.values()).find(p => p.playerId === playerId);
  }

  isController(game: IGameObject, playerId): boolean {
    return game.controlledPlayersMap.has(playerId);
  }
}
