import { v4 } from 'uuid';

export interface IGameObject {
  gameId: string;
  gameCode: string;
}

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

  createNewGame(): IGameObject {
    const gameId = v4();
    const gameCode = this.generateGameCode();

    return {
      gameId,
      gameCode,
    };
  }
}
