import { IGraphQLContext } from '../../context';
import { ESubscriptionTopics, pubsub } from '../../pubsub';
import { IPlayer } from '../../../core/local-data/game-manager';

let shotId = 1;
export const notifyShot = (rootValue, {byPlayerId, shotPosition}, {games, game, player}: IGraphQLContext) => {
  if (!game || !player) {
    return null;
  }
  const shootingPlayer = ((game.controlledPlayersMap.get(byPlayerId) || player) as IPlayer);

  shotId = (shotId + 1);
  pubsub.publish(ESubscriptionTopics.GUN_SHOT, {
    gunShot: {
      id: shotId,
      byPlayer: shootingPlayer,
      shotPosition: shotPosition,
      time: Date.now(),
      gameId: game.gameId,
    }
  });

  return true;
};
