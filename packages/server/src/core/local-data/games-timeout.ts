// holds games and last active time
// every 5 min if game timeout > current
import { GamesManager } from './game-manager';
import { config } from '../../settings/config';

export class GamesTimeout {

  private INTERVAL_MS = 60000;
  public lastActiveGamesTime: Map<string, number> = new Map();

  constructor(private gameManager: GamesManager) {
  }

  startTimeoutChecks() {
    setInterval(() => {
      this.lastActiveGamesTime.forEach((lastActiveTime, gameId) => {
        const now = Date.now();
        if (now - (config.gameTimeoutSec * 1000) > lastActiveTime) {
          this.gameManager.endGame(gameId);

          this.lastActiveGamesTime.delete(gameId);
        }
      })

    }, this.INTERVAL_MS)
  }


  setGameLastActiveTime(gameId: string) {
    this.lastActiveGamesTime.set(gameId, Date.now());
  }

}