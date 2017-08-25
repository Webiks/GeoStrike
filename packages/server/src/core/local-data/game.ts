import { v4 } from 'uuid';
import { sign } from 'jsonwebtoken';
import { GameState, PlayerState } from '../../types';

interface ICartesian3Location {
  x: number;
  y: number;
  z: number;
}

export interface IPlayer {
  playerId: string;
  token: string;
  character: string;
  username: string;
  state: PlayerState;
  game: IGameObject;
  initialLocation: ICartesian3Location;
  currentLocation: ICartesian3Location;
}

export interface IGameObject {
  gameId: string;
  gameCode: string;
  players: IPlayer[];
  state: GameState;
}

const TOKENS_SECRET = 'sdf43tSWDG#%Tsdfw4';

const DEFAULT_PLAYERS_LOCATION = [
  { x: 1550673.088988461, y: -4493525.238126923, z: 4238303.0193881355 },
  { x: 1550635.687128656, y: -4493541.399794866, z: 4238299.591664443 },
  { x: 1550651.2920068908, y: -4493566.551705495, z: 4238267.4323070375 },
  { x: 1550666.5874257954, y: -4493592.65530189, z: 4238234.382695068 },
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

  addPlayerToGame(gameId: string, character: string, username: string): IPlayer {
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
      initialLocation: DEFAULT_PLAYERS_LOCATION[game.players.length],
      currentLocation: DEFAULT_PLAYERS_LOCATION[game.players.length],
    };

    game.players.push(player);

    return player;
  }

  createNewGame(): IGameObject {
    const gameId = v4();
    const gameCode = this.generateGameCode();

    const gameObject: IGameObject = {
      gameId,
      gameCode,
      players: [],
      state: 'WAITING',
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
    const player = game.players.find(p => p.playerId === playerId);

    if (player) {
      player.state = 'READY';
    }
  }
}
