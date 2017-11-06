import { IGraphQLContext } from '../../context';
import { ESubscriptionTopics, pubsub } from '../../pubsub';
import { IPlayer } from '../../../core/local-data/game-manager';

export const notifyShot = (rootValue, {byPlayerId, shotPosition}, {games, game, player}: IGraphQLContext) => {
  if (!game || !player) {
    return null;
  }
  const shootingPlayer = ((game.controlledPlayersMap.get(byPlayerId) || player) as IPlayer);

  pubsub.publish(ESubscriptionTopics.GUN_SHOT, {
    shotGun: {
      byPlayer: shootingPlayer,
      shotPosition: shotPosition,
      time: Date.now(),
    }
  });

  return player;
};
