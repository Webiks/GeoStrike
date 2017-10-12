import { IGraphQLContext } from '../../context';
import { ESubscriptionTopics, pubsub } from '../../pubsub';

export const joinGame = (rootValue, { gameCode, character, username, team }, { games }: IGraphQLContext) => {
  const game = games.getGameByCode(gameCode);
  const player = games.addRealPlayerToGame(game.gameId, character, username, team);

  pubsub.publish(ESubscriptionTopics.GAME_STATE_CHANGED, { gameData: game });

  const message =
    `<span style="color:${player.team.toString().toLowerCase()}">${player.username}</span> <span>has joined the game</span>`;

  pubsub.publish(ESubscriptionTopics.GAME_NOTIFICATIONS, {gameNotifications: {message, gameId: game.gameId}});

  return {
    game,
    player,
  };
};
