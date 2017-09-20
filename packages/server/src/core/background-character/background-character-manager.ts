import { Settings } from '../../settings/settings';
import { CharacterType, GamesManager, ICartesian3Location, IGameObject, IPlayer, Team } from '../local-data/game';
import { loadPath, PathNode } from './path-node';
import * as Cesium from 'cesium';
import { LatLonEllipsoidal } from 'geodesy';
import v4 = require('uuid/v4');

export class BackgroundCharacterManager {
  private NUMBER_OF_BG_CHARACTERS;
  private UPDATE_INTERVAL_MS;
  private UPDATE_DISTANCE;
  private availablePathNodes: [PathNode];
  private intervalId;
  private game: IGameObject;
  private bgCharacterToNextLocation: Map<string, PathNode> = new Map();

  constructor(private gameId: string,
              private gameManager: GamesManager) {
    this.NUMBER_OF_BG_CHARACTERS = Settings.backgroundCharacters.updateIntervalMs;
    this.UPDATE_INTERVAL_MS = Settings.backgroundCharacters.updateIntervalMs;
    this.UPDATE_DISTANCE = Settings.backgroundCharacters.updateDistanceMeters;
    this.availablePathNodes = loadPath();
  }

  private getRandomLocation(pathNodes: [PathNode]) {
    return pathNodes[Math.random() * (pathNodes.length - 1)];
  }

  initBgCharacters() {
    this.game = this.gameManager.getGameById(this.gameId);
    for (let i = 0; i < this.NUMBER_OF_BG_CHARACTERS; i++) {
      const currentPath = this.availablePathNodes[i];
      const bgPlayer = {
        playerId: v4(),
        character: 'old_lady',
        state: 'ALIVE',
        game: this.game,
        currentLocation: currentPath.location,
        heading: 0,
        team: Team.NONE,
        type: CharacterType.BACKGROUND_CHARACTER,
        syncState: 'VALID',
      } as IPlayer;

      const nextLocationNode = this.getRandomLocation(currentPath.points);
      this.bgCharacterToNextLocation.set(bgPlayer.playerId, nextLocationNode);
      this.gameManager.addPlayerToGame(this.gameId, bgPlayer);
    }
  }

  startCharactersMovement() {
    this.intervalId = setInterval(() => {
      this.bgCharacterToNextLocation.forEach((nextPath, characterId) => {
        const character = this.game.playersMap.get(characterId);

        if (character.state !== 'DEAD') {
          // update location
          const currentPos = character.currentLocation;
          const nextNodePos = this.bgCharacterToNextLocation.get(characterId);
          const {heading, nextLocation} = this.calcNextLocation(currentPos, nextNodePos, characterId);

          this.gameManager.updatePlayerPosition(this.gameId, characterId, nextLocation, heading);
        }
      })
    }, this.UPDATE_INTERVAL_MS);
  }

  private calcNextLocation(from: ICartesian3Location, destinationNode: PathNode, characterId) {
    const currentPosition = new Cesium.Cartographic.fromCartesian(from);
    const finalPosition = new Cesium.Cartographic.fromCartesian(destinationNode.location);

    const currentLatLon = new LatLonEllipsoidal(
      Cesium.Math.doDegree(currentPosition.latitude),
      Cesium.Math.doDegree(currentPosition.longitude));

    const finalLatLon = new LatLonEllipsoidal(
      Cesium.Math.doDegree(finalPosition.latitude),
      Cesium.Math.doDegree(finalPosition.longitude));

    const distance = currentLatLon.distanceTo(finalLatLon);

    // Check if reached destination node
    if (distance < this.UPDATE_DISTANCE) {
      const newDestinationPath = this.getRandomLocation(destinationNode.points);
      this.bgCharacterToNextLocation.set(characterId, newDestinationPath);

      return this.calcNextLocation(from, newDestinationPath, characterId);
    }

    const initialBearing = currentLatLon.initialBearingTo(finalLatLon);
    const nextLocation = currentLatLon.destinationPoint(initialBearing, this.UPDATE_DISTANCE);

    return {
      heading: initialBearing,
      nextLocation: nextLocation.toCartesian(),
    }
  }

  stop() {
    clearInterval(this.intervalId);
  }
}