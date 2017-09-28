import { Settings } from '../../settings/settings';
import {
  CharacterType,
  GamesManager,
  ICartesian3Location,
  IGameObject,
  IPlayer,
  Team,
} from '../local-data/game';
import { PathNode, pathsGraph } from './path-node';
import * as Cesium from 'cesium';
import { LatLonSpherical } from 'geodesy';
import v4 = require('uuid/v4');

export class BackgroundCharacterManager {
  private NUMBER_OF_BG_CHARACTERS;
  private UPDATE_INTERVAL_MS;
  private UPDATE_DISTANCE;
  private availablePathNodes: [PathNode];
  private intervalId;
  private game: IGameObject;
  private bgCharacterToNextLocation: Map<string, PathNode> = new Map();

  constructor(private gameId: string, private gameManager: GamesManager) {
    this.NUMBER_OF_BG_CHARACTERS =
      Settings.backgroundCharacters.numberOfBgCharacters;
    this.UPDATE_INTERVAL_MS = Settings.backgroundCharacters.updateIntervalMs;
    this.UPDATE_DISTANCE = Settings.backgroundCharacters.updateDistanceMeters;
    this.availablePathNodes = pathsGraph;
  }

  private getRandomLocation(pathNodes: [PathNode]) {
    return pathNodes[Math.round(Math.random() * (pathNodes.length - 1))];
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
          const { heading, nextLocation } = this.calcNextLocation(
            currentPos,
            nextNodePos,
            characterId
          );

          this.gameManager.updatePlayerPosition(
            this.gameId,
            characterId,
            nextLocation,
            heading,
            true
          );
        }
      });
    }, this.UPDATE_INTERVAL_MS);
  }

  private calcNextLocation(
    from: ICartesian3Location,
    destinationNode: PathNode,
    characterId
  ) {
    const currentPosition = new Cesium.Cartesian3(from.x, from.y, from.z);
    const destPosition = destinationNode.location;
    const finalPosition = new Cesium.Cartesian3(
      destPosition.x,
      destPosition.y,
      destPosition.z
    );

    const distance = Cesium.Cartesian3.distance(currentPosition, finalPosition);

    // Check if reached destination node
    if (distance < this.UPDATE_DISTANCE) {
      const newDestinationPath = this.getRandomLocation(destinationNode.points);
      this.bgCharacterToNextLocation.set(characterId, newDestinationPath);

      return this.calcNextLocation(from, newDestinationPath, characterId);
    }

    let interpolate = this.UPDATE_DISTANCE / distance;
    interpolate = parseFloat(interpolate.toFixed(2));
    let nextLocation = new Cesium.Cartesian3();
    nextLocation = Cesium.Cartesian3.lerp(
      currentPosition,
      finalPosition,
      interpolate,
      nextLocation
    );

    const bearing = this.calculateBearing(currentPosition, nextLocation);
    return {
      heading: bearing,
      nextLocation,
    };
  }

  calculateBearing(firtst: ICartesian3Location, second: ICartesian3Location) {
    const firtstCart = Cesium.Cartographic.fromCartesian(firtst);
    const secondCart = Cesium.Cartographic.fromCartesian(second);

    const y =
      Math.sin(secondCart.longitude - firtstCart.longitude) *
      Math.cos(secondCart.latitude);
    const x =
      Math.cos(firtstCart.latitude) * Math.sin(secondCart.latitude) -
      Math.sin(firtstCart.latitude) *
        Math.cos(secondCart.latitude) *
        Math.cos(secondCart.longitude - secondCart.longitude);
    const brng = Cesium.Math.toDegrees(Math.atan2(y, x));

    return (brng + 180) % 360;
  }

  stop() {
    clearInterval(this.intervalId);
  }
}
