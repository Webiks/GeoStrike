import * as query from './query';
import * as mutation from './mutation';
import * as subscription from './subscription';
import * as game from './game';
import * as player from './player-viewer';
import * as notification from './notification';
import * as shotData from './shot-data';
import * as flight from './flight'
import * as beenShotData from './been-shot-data';

export default {
  query,
  game,
  player,
  notification,
  shotData,
  beenShotData,
  subscription,
  mutation,
  flight,
};
