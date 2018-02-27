import {IGraphQLContext} from '../../context';
import {ESubscriptionTopics, pubsub} from '../../pubsub';
import {CharacterType, IPlayer} from '../../../core/local-data/game-manager';

export const notifyBeenShot = (rootValue, {playerId}, {games, game, player}: IGraphQLContext) => {
    if (!game || !player) {
      return null;
    }
    const numOfShotsToKill: number = 4;
    let shotPlayer = game.playersMap.get(playerId);
    let lifeState;
    const ShootingPlayer = ((game.controlledPlayersMap.get(playerId) || player) as IPlayer);
    const ShotPlayerState = shotPlayer.state;
    shotPlayer.numberOfShotsThatHit += 1;
    const lifeStatePerctange = 100 * (1 - shotPlayer.numberOfShotsThatHit / numOfShotsToKill);
    const lifeStatePerctangeRounded = Math.ceil(4 * (1 - (shotPlayer.numberOfShotsThatHit / numOfShotsToKill))) / 4;

    games.updateLifeStatePerctange(game.gameId, playerId,lifeStatePerctange);

    if (!ShootingPlayer || !ShootingPlayer.team || !shotPlayer || !shotPlayer.team ||
        ShotPlayerState === 'DEAD' ||
        shotPlayer.type === CharacterType.BACKGROUND_CHARACTER) {
        games.updatePlayerLifeState(game.gameId, playerId, 'EMPTY');
        return shotPlayer;
    }
    if (lifeStatePerctangeRounded === 0.75)
    {
        lifeState = 'HIGH'
    }
    else if (lifeStatePerctangeRounded === 0.5)
    {
        lifeState = 'MEDIUM'
    }
    else if (lifeStatePerctangeRounded === 0.25)
    {
        lifeState = 'LOW'
    }
    else if (lifeStatePerctangeRounded === 0){
        lifeState = 'EMPTY'
    }
    games.updatePlayerLifeState(game.gameId, playerId, lifeState);

    pubsub.publish(ESubscriptionTopics.BEEN_SHOT, {
        beenShot: {
            id: playerId,
            lifeState: lifeState,
            gameId: game.gameId,
            byPlayer: ShootingPlayer
        }
    });
    return shotPlayer;

};
