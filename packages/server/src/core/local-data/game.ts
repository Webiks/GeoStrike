import { v4 } from 'uuid';
import { sign } from 'jsonwebtoken';
import { GameState, PlayerState } from '../../types';
import { ESubscriptionTopics, pubsub } from '../../graphql/pubsub';
import { gameData } from '../../graphql/resolvers/subscriptions/game-data';

interface ICartesian3Location {
  x: number;
  y: number;
  z: number;
}

export enum Team {
  RED = 'RED',
  BLUE = 'BLUE',
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
}

export interface IGameObject {
  gameId: string;
  gameCode: string;
  gameUpdateInterval: any,
  playersMap: Map<string, IPlayer>;
  players: IPlayer[],
  state: GameState;
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

  addPlayerToGame(gameId: string, character: string, username: string, team: Team): IPlayer {
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
      currentLocation: DEFAULT_PLAYERS_LOCATION[game.players.length],
      heading: 0,
      team,
    };

    game.playersMap.set(playerId, player);
    game.players.push(player);

    return player;
  }

  createNewGame(): IGameObject {
    const gameId = v4();
    const gameCode = this.generateGameCode();

    const gameObject: IGameObject = {
      gameId,
      gameCode,
      playersMap: new Map<string, IPlayer>(),
      players: [],
      state: 'WAITING',
      gameUpdateInterval: setInterval(() => {
        pubsub.publish(ESubscriptionTopics.GAME_STATE_CHANGED, {
          gameData: {
            gameId,
            gameCode,
            players: gameObject.players,
            state: gameObject.state,
          }
        })
      }, 100),
    };

    this.activeGames.set(gameId, gameObject);

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

    if (player) {
      player.currentLocation = position;
      player.heading = heading;
    }
  }
}
