import { ESubscriptionTopics, pubsub } from '../../graphql/pubsub';
import { IGameObject } from '../local-data/game';
import { Settings } from '../../settings/settings';

export const createClientsUpdater = (gameObject: IGameObject) => {
  return setInterval(() => {
    pubsub.publish(ESubscriptionTopics.GAME_STATE_CHANGED, {
      gameData: {
        gameId: gameObject.gameId,
        gameCode: gameObject.gameCode,
        players: gameObject.players,
        state: gameObject.state,
      },
    });
  }, Settings.clientsUpdateRate);
};