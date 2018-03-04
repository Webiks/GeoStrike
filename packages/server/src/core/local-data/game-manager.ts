import { v4 } from 'uuid';
import { sign } from 'jsonwebtoken';
import { CharacterData, GameState, PlayerState, PlayerSyncState, PlayerLifeState, FlightData } from '../../types';
import * as Cesium from 'cesium';
import { config } from '../../settings/config';
import { startClientsUpdater, stopClientsUpdater } from '../clients-updater/clients-updater';
import { BackgroundCharacterManager } from '../background-character/background-character-manager';
import { PLAYER_CHARACTERS } from './characters';
import { GamesTimeout } from './games-timeout';
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
    lifeState: PlayerLifeState;
    lifeStatePerctange: number;
    numberOfShotsThatHit: number;
    isCrawling: boolean;
    isFlying: boolean;
    flight: FlightData;
    isShooting: boolean;
    game: IGameObject;
    currentLocation: ICartesian3Location;
    heading: number;
    team: Team;
    syncState: PlayerSyncState;
    type: CharacterType;
    enteringBuildingPosition?: ICartesian3Location | undefined;
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
  private gamesTimeouts: GamesTimeout;

  constructor() {
    this.gamesTimeouts = new GamesTimeout(this);
    this.gamesTimeouts.startTimeoutChecks();
  }

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
    const finalUsername = this.validateUsername(username, game);
    const playerToken = sign(
      {
        gameId: game.gameId,
        playerId,
        username: finalUsername,
      },
      TOKENS_SECRET
    );

    const viewer = {
      token: playerToken,
      playerId,
      username: finalUsername,
    };
    game.viewers.push(viewer);
    return viewer;
  }

  private validateUsername(username: string, game: IGameObject, isFirst = true): string {
    const exists = Array.from(game.playersMap.values()).find(p => p.username === username);
    if (exists) {
      let newUsername = null;
      if (isFirst) {
        newUsername = username + '1'
      } else {
        const count = +username.slice(-1);
        newUsername = username.slice(0, -1) + (count + 1);
      }
      return this.validateUsername(newUsername, game, false);
    } else {
      return username;
    }
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

    const defaultPlayerPositions = config.PLAYERS_SPAWN_POSITIONS[team];
    const realPlayerTeamCount = Array.from(game.playersMap.values()).filter(
      p => p.type === CharacterType.PLAYER && p.team === team
    ).length;

        const initFlightData: FlightData = {
          speed :"NONE",
          minHeight : 195,
          maxHeight: 500,
          remainingTime: 51300 //300sec =  5min minutes in seconds
        }

        const finalUsername = this.validateUsername(username, game);
        const character = PLAYER_CHARACTERS.find(p => p.name === characterName);
        const player: IPlayer = {
            playerId,
            character,
            token: playerToken,
            username: finalUsername,
            state: 'WAITING',
            lifeState: 'FULL',
            lifeStatePerctange: 100,
            numberOfShotsThatHit: 0,
            game,
            currentLocation: defaultPlayerPositions[realPlayerTeamCount],
            heading: 0,
            team,
            type: CharacterType.PLAYER,
            isCrawling: false,
            isFlying: false,
            flight: initFlightData,
            isShooting: false,
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
                       isFlying: boolean,
                       isShooting: boolean,
                       enteringBuildingPosition: ICartesian3Location,
                       skipValidation = false) {
    const game = this.getGameById(gameId);
    const player = game.playersMap.get(playerId);

    // Update game active time
    if (player.type === CharacterType.PLAYER) {
      this.gamesTimeouts.setGameLastActiveTime(gameId);
    }

    if (player && position) {
      if (
        skipValidation ||
        this.validatePlayerPosition(player.currentLocation, position)
      ) {
        player.syncState = 'VALID';
        player.currentLocation = position;
        player.heading = heading;
        player.isCrawling = isCrawling;
        player.isShooting = isShooting;
        player.isFlying= isFlying;
        player.enteringBuildingPosition = enteringBuildingPosition;
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

  updatePlayerLifeState(gameId: string, playerId: string, newState: PlayerLifeState){
      const game = this.getGameById(gameId);
      const player = game.controlledPlayersMap.get(playerId) || game.playersMap.get(playerId);
      if (player) {
          player.lifeState = newState;
      }
  }

    updateLifeStatePerctange(gameId: string, playerId: string, newState: number){
        const game = this.getGameById(gameId);
        const player = game.controlledPlayersMap.get(playerId) || game.playersMap.get(playerId);
        if (player) {
            player.lifeStatePerctange = newState;
        }
    }private checkGameResult(game: IGameObject) {
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
    const controlledPlayer: IPlayer = game.playersMap.get(controlledPlayerId);
    controlledPlayer.state = 'CONTROLLED';
    game.controlledPlayersMap.set(playerId, controlledPlayer);
    return controlledPlayer;
  }

  removeControlOverPlayer(game, playerId: string): IPlayer {
    const controlledPlayer: IPlayer = game.controlledPlayersMap.get(playerId);
    if (controlledPlayer) {
      controlledPlayer.state = controlledPlayer.state === 'CONTROLLED' ? 'ALIVE' : controlledPlayer.state;
      game.controlledPlayersMap.delete(playerId);
    }
    return controlledPlayer;
  }

  isControlled(game: IGameObject, playerId): boolean {
    return !!Array.from(game.controlledPlayersMap.values()).find(p => p.playerId === playerId);
  }

  isController(game: IGameObject, playerId): boolean {
    return game.controlledPlayersMap.has(playerId);
  }
}
