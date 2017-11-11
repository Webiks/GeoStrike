import { IGraphQLContext } from '../../context';
import { ESubscriptionTopics, pubsub } from '../../pubsub';
import { IGameObject, IPlayer, IViewer } from '../../../core/local-data/game-manager';


export const ready = (rootValue, args, {games, game, player}: IGraphQLContext) => {
  if (!game || !player) {
    return null;
  }
  games.playerReady(game.gameId, player.playerId);
  pubsub.publish(ESubscriptionTopics.GAME_STATE_CHANGED, {gameData: game});

  notifyOtherPlayers(player, game);

  return game;
};

const notifyOtherPlayers = (player: IPlayer | IViewer, game: IGameObject) => {
  const color = (player as IPlayer).team ? (player as IPlayer).team.toString().toLowerCase() : '';
  const message =
    `<span style="color:${color}">${player.username}</span> <span>has joined the game</span>`;
  pubsub.publish(ESubscriptionTopics.GAME_NOTIFICATIONS, {gameNotifications: {message, gameId: game.gameId}});
};
