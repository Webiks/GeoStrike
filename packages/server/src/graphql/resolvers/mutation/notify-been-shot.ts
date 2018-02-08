import {IGraphQLContext} from '../../context';
import {ESubscriptionTopics, pubsub} from '../../pubsub';
import {CharacterType, IPlayer} from '../../../core/local-data/game-manager';

export const notifyBeenShot = (rootValue, {playerId}, {games, game, player}: IGraphQLContext) => {
    if (!game || !player) {
      return null;
    }
    const numOfShotsToKill: number = 4;
    let shotPlayer = game.playersMap.get(playerId);

    shotPlayer.numberOfShotsThatHit += 1;
    let lifeStatePerctange = Math.ceil(4 * (1 - (shotPlayer.numberOfShotsThatHit / numOfShotsToKill))) / 4;
    // console.log("numberOfShotsHitsThatHit"+shotPlayer.numberOfShotsThatHit);
    // console.log("lifeStatePerctange"+lifeStatePerctange)
    // console.log("shotPlayer.numberOfShotsThatHit"+shotPlayer.numberOfShotsThatHit)
    // console.log("numOfShotsToKill"+numOfShotsToKill)

    if (lifeStatePerctange === 0.75)
        games.updatePlayerLifeState(game.gameId, playerId, 'THREE_QUARTERS');
    else if (lifeStatePerctange === 0.5)
        games.updatePlayerLifeState(game.gameId, playerId, 'HALF_FULL');
    else if (lifeStatePerctange === 0.25)
        games.updatePlayerLifeState(game.gameId, playerId, 'QUARTER');
    else if (lifeStatePerctange === 0){
        games.updatePlayerLifeState(game.gameId, playerId, 'EMPTY');
        // games.updatePlayerState(game.gameId, playerId, 'DEAD');
    }

    pubsub.publish(ESubscriptionTopics.GAME_NOTIFICATIONS, { gameNotifications: {  gameId: game.gameId } });

    return shotPlayer;

};
