import { IGraphQLContext } from '../../context';
import { ESubscriptionTopics, pubsub } from '../../pubsub';

export const notifyCrash = (rootValue, {playerId}, {games, game, player}: IGraphQLContext) => {
    if (!game || !player) {
        return null;
    }

    const crashedPlayer = game.playersMap.get(playerId);

    games.updatePlayerState(game.gameId, playerId, 'DEAD');
    pubsub.publish(ESubscriptionTopics.GAME_STATE_CHANGED, { gameData: game });

    const killedPlayerTeamColor = crashedPlayer.team.toString().toLowerCase();

    let message =
        `<span style="color:${killedPlayerTeamColor}">${crashedPlayer.username}</span> <span>has crashed</span>`;

    pubsub.publish(ESubscriptionTopics.GAME_NOTIFICATIONS, {  gameNotifications: { message, gameId: game.gameId }})

}