import {IGraphQLContext} from '../../context';
import {ESubscriptionTopics, pubsub} from '../../pubsub';
import {CharacterType, IPlayer} from '../../../core/local-data/game-manager';

export const notifyBeenShot = (rootValue, {playerId}, {games, game, player}: IGraphQLContext) => {
    if (!game || !player) {
      return null;
    }
    const numOfShotsToKill: number = 4;
    let shotPlayer = game.playersMap.get(playerId);
    const ShootingPlayer = ((game.controlledPlayersMap.get(playerId) || player) as IPlayer);
    const ShotPlayerState = shotPlayer.state;
    shotPlayer.numberOfShotsThatHit += 1;
    let lifeStatePerctange = Math.ceil(4 * (1 - (shotPlayer.numberOfShotsThatHit / numOfShotsToKill))) / 4;

    if (!ShootingPlayer || !ShootingPlayer.team || !shotPlayer || !shotPlayer.team ||
        ShotPlayerState === 'DEAD' ||
        shotPlayer.type === CharacterType.BACKGROUND_CHARACTER) {
        games.updatePlayerLifeState(game.gameId, playerId, 'EMPTY');
        return shotPlayer;
    }
    if (lifeStatePerctange === 0.75)
        games.updatePlayerLifeState(game.gameId, playerId, 'HIGH');
    else if (lifeStatePerctange === 0.5)
        games.updatePlayerLifeState(game.gameId, playerId, 'MEDIUM');
    else if (lifeStatePerctange === 0.25)
        games.updatePlayerLifeState(game.gameId, playerId, 'LOW');
    else if (lifeStatePerctange === 0){
        games.updatePlayerLifeState(game.gameId, playerId, 'EMPTY');
    }
    return shotPlayer;

};
