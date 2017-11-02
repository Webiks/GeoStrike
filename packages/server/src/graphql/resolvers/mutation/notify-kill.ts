import { IGraphQLContext } from '../../context';
import { ESubscriptionTopics, pubsub } from '../../pubsub';
import { CharacterType, IPlayer } from '../../../core/local-data/game-manager';

export const notifyKill = (rootValue, { playerId }, { games, game, player }: IGraphQLContext) => {
  if (!game || !player) {
    return null;
  }

  const shootingPlayer = ((game.controlledPlayersMap.get(playerId) || player) as IPlayer);
  const shotPlayer = game.playersMap.get(playerId);
  const shotPlayerState = shotPlayer.state;

  games.updatePlayerState(game.gameId, playerId, 'DEAD');
  pubsub.publish(ESubscriptionTopics.GAME_STATE_CHANGED, { gameData: game });

  if (!shootingPlayer || !shootingPlayer.team || !shotPlayer || !shotPlayer.team ||
    shotPlayerState === 'DEAD' ||
    shotPlayer.type === CharacterType.BACKGROUND_CHARACTER) {
    return player;
  }
  const killingPlayerTeamColor = shootingPlayer.team.toString().toLowerCase();
  const killedPlayerTeamColor = shotPlayer.team.toString().toLowerCase();

  const message =
    `<span style="color:${killingPlayerTeamColor}">${shootingPlayer.username}</span> <span>has killed</span> <span style="color:${killedPlayerTeamColor}">${shotPlayer.username}</span>`;

  pubsub.publish(ESubscriptionTopics.GAME_NOTIFICATIONS, { gameNotifications: { message, gameId: game.gameId } });

  return player;
};
