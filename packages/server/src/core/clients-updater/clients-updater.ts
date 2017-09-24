import { ESubscriptionTopics, pubsub } from '../../graphql/pubsub';
import { IGameObject } from '../local-data/game';
import { Settings } from '../../settings/settings';

function updateClientsLoop(gameObject: IGameObject) {
  pubsub.publish(ESubscriptionTopics.GAME_STATE_CHANGED, {
    gameData: gameObject
  });

  gameObject.clientsUpdater = setTimeout(() => {
    updateClientsLoop(gameObject);
  }, Settings.clientsUpdateRate);
}

export const startClientsUpdater = (gameObject: IGameObject) => {
  updateClientsLoop(gameObject);
};
