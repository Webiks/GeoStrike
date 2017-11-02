import { ESubscriptionTopics, pubsub } from '../../graphql/pubsub';
import { IGameObject } from '../local-data/game-manager';
import { config } from '../../settings/config';

function updateClientsLoop(gameObject: IGameObject) {
  pubsub.publish(ESubscriptionTopics.GAME_STATE_CHANGED, {
    gameData: gameObject
  });

  gameObject.clientsUpdaterId = setTimeout(() => {
    updateClientsLoop(gameObject);
  }, config.clientsUpdateRate);
}

export const startClientsUpdater = (gameObject: IGameObject) => {
  updateClientsLoop(gameObject);
};

export const stopClientsUpdater = (gameObject: IGameObject) => {
  clearTimeout(gameObject.clientsUpdaterId);
};
