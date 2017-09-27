import { ESubscriptionTopics, pubsub } from '../../pubsub';
import { IGraphQLContext } from '../../context';
import { JoinAsViewerMutationArgs } from '../../../types';
import { JoinAsViewer } from '../../../../../client/src/app/types';

export const joinAsViewer = (rootValue, {gameCode, username}: JoinAsViewerMutationArgs, {games}: IGraphQLContext) => {
  const game = games.getGameByCode(gameCode);

  const viewer = games.addViewerToGame(game.gameId, username);
  pubsub.publish(ESubscriptionTopics.GAME_STATE_CHANGED, {gameData: game});

  console.log('sdsds',viewer.token);
  return {
    game,
    player: viewer,
  };
};