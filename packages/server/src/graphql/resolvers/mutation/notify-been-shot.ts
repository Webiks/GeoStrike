import {IGraphQLContext} from '../../context';
import {ESubscriptionTopics, pubsub} from '../../pubsub';
import {CharacterType, IPlayer} from '../../../core/local-data/game-manager';

export const notifyBeenShot = (rootValue, {playerId}, {games, game, player}: IGraphQLContext) => {
    // if (!game || !player) {
    //   return null;
    // }
    const numOfShotsToKill: number = 4;
    const shootingPlayer = ((game.controlledPlayersMap.get(playerId) || player) as IPlayer);
    const shotPlayer = game.playersMap.get(playerId);

    shotPlayer.numberOfShotsHitsThatHit += 1;
    let lifeStatePerctange = 1 - (shotPlayer.numberOfShotsHitsThatHit / numOfShotsToKill);
    console.log("lifeStatePerctange"+lifeStatePerctange)
    console.log("shotPlayer.numberOfShotsHitsThatHit"+shotPlayer.numberOfShotsHitsThatHit)
    console.log("numOfShotsToKill"+numOfShotsToKill)

    if (lifeStatePerctange >= 0.75)
        games.updatePlayerLifeState(game.gameId, playerId, 'THREE_QUARTERS');
    else if (lifeStatePerctange < 0.75 && lifeStatePerctange >= 0.5)
        games.updatePlayerLifeState(game.gameId, playerId, 'HALF_FULL');
    else if (lifeStatePerctange < 0.50 && lifeStatePerctange >= 0.25)
        games.updatePlayerLifeState(game.gameId, playerId, 'QUARTER');
    else if (lifeStatePerctange < 0.25){
        games.updatePlayerLifeState(game.gameId, playerId, 'EMPTY');
        // games.updatePlayerState(game.gameId, playerId, 'DEAD');
    }
    return shotPlayer;
};
