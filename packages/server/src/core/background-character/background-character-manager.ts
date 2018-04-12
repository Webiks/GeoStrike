import { config } from '../../settings/config';
import {
  CharacterType,
  GamesManager,
  ICartesian3Location,
  IGameObject,
  IPlayer,
  Team,
} from '../local-data/game-manager';
import { PathNode, PATHS_GRAPHS } from './path-node';
import * as Cesium from 'cesium';
import { PLAYER_CHARACTERS } from '../local-data/characters';
import v4 = require('uuid/v4');

const BG_CHARACTER_TYPES = [
  {
    characterName: 'grandpa',
    paths: PATHS_GRAPHS.PEOPLE,
    updateDistanceMeters: 0.1,
  },
    {
        characterName: 'deer',
        paths: PATHS_GRAPHS.DEER,
        updateDistanceMeters: 0.2,
    },
    {
        characterName: 'rhino',
        paths: PATHS_GRAPHS.RHINO,
        updateDistanceMeters: 0.2,
    },
  {
    characterName: 'car',
    paths: PATHS_GRAPHS.CAR,
    updateDistanceMeters: 1.0,
  },
];

export class BackgroundCharacterManager {
  private NUMBER_OF_BG_CHARACTERS;
  private UPDATE_INTERVAL_MS;
  private intervalId;
  private game: IGameObject;
  private bgCharacterToNextLocation: Map<string, PathNode> = new Map();
  private initialLocationId: Map<string, string[]> = new Map(); // character type to initial location id

  constructor(private gameId: string, private gameManager: GamesManager) {
    this.NUMBER_OF_BG_CHARACTERS =
      config.backgroundCharacters.numberOfBgCharacters;
    this.UPDATE_INTERVAL_MS = config.backgroundCharacters.updateIntervalMs;

    BG_CHARACTER_TYPES.forEach(c => this.initialLocationId.set(c.characterName, []));
  }

  private getRandomLocation(pathNodes: PathNode[]) {
    const index = Math.round(Math.random() * (pathNodes.length - 1));
    return pathNodes[index];
  }

  initBgCharacters() {
    this.game = this.gameManager.getGameById(this.gameId);
    for (let i = 0; i < this.NUMBER_OF_BG_CHARACTERS; i++) {
      const randomTypeIndex = Math.round(Math.random() * (BG_CHARACTER_TYPES.length - 1));
      const characterType = BG_CHARACTER_TYPES[randomTypeIndex];
      this.createBgPlayer(characterType.characterName, characterType.paths);
    }
  }

  private getInitialLocation(characterTypeName: string, paths: PathNode[]) {
    const currentPath = this.getRandomLocation(paths);
    const initialLocationIds = this.initialLocationId.get(characterTypeName);

    if (initialLocationIds.find(pathId => pathId === currentPath.id)) {
      return this.getInitialLocation(characterTypeName, paths);
    } else {
      initialLocationIds.push(currentPath.id);
      return currentPath;
    }
  }

  private createBgPlayer(characterTypeName: string, paths: PathNode[]) {
    const currentPath = this.getInitialLocation(characterTypeName, paths);

    const character = PLAYER_CHARACTERS.find(p => p.name === characterTypeName);
    const bgPlayer = {
      playerId: v4(),
      character,
      state: 'ALIVE',
      game: this.game,
      currentLocation: currentPath.location,
      heading: 0,
      team: Team.NONE,
      type: CharacterType.BACKGROUND_CHARACTER,
      syncState: 'VALID',
      isCrawling: false,
      isShooting: false,
      isFlying: false,
    } as IPlayer;

    const nextLocationNode = this.getRandomLocation(currentPath.points);
    this.bgCharacterToNextLocation.set(bgPlayer.playerId, nextLocationNode);
    this.gameManager.addPlayerToGame(this.gameId, bgPlayer);
  }

  startCharactersMovement() {
    this.intervalId = setInterval(() => {
      this.bgCharacterToNextLocation.forEach((nextPath, characterId) => {
        const character = this.game.playersMap.get(characterId);

        if (character.state !== 'DEAD') {
          // update location
          const currentPos = character.currentLocation;
          const nextNodePos = this.bgCharacterToNextLocation.get(characterId);
          const { updateDistanceMeters } = BG_CHARACTER_TYPES.find(c => c.characterName === character.character.name);
          const { heading, nextLocation } = this.calcNextLocation(
            currentPos,
            nextNodePos,
            characterId,
            updateDistanceMeters
          );
          this.gameManager.updatePlayerPosition(
            this.gameId,
            characterId,
            nextLocation,
            heading,
            false,
            true,
            false,
            undefined
          );
        }
      });
    }, this.UPDATE_INTERVAL_MS);
  }

  private calcNextLocation(from: ICartesian3Location,
                           destinationNode: PathNode,
                           characterId,
                           updateDistanceMeters: number) {
    const currentPosition = new Cesium.Cartesian3(from.x, from.y, from.z);
    const destPosition = destinationNode.location;
    const finalPosition = new Cesium.Cartesian3(
      destPosition.x,
      destPosition.y,
      destPosition.z
    );

    const distance = Cesium.Cartesian3.distance(currentPosition, finalPosition);

    // Check if reached destination node
    if (distance < updateDistanceMeters) {
      const newDestinationPath = this.getRandomLocation(destinationNode.points);
      this.bgCharacterToNextLocation.set(characterId, newDestinationPath);

      return this.calcNextLocation(from, newDestinationPath, characterId, updateDistanceMeters);
    }

    let interpolate = updateDistanceMeters / distance;
    interpolate = parseFloat(interpolate.toFixed(8));
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

  calculateBearing(first: ICartesian3Location, second: ICartesian3Location) {
    const firstCart = Cesium.Cartographic.fromCartesian(first);
    const secondCart = Cesium.Cartographic.fromCartesian(second);

    const y =
      Math.sin(secondCart.longitude - firstCart.longitude) *
      Math.cos(secondCart.latitude);
    const x =
      Math.cos(firstCart.latitude) * Math.sin(secondCart.latitude) -
      Math.sin(firstCart.latitude) *
      Math.cos(secondCart.latitude) *
      Math.cos(secondCart.longitude - secondCart.longitude);
    const brng = Cesium.Math.toDegrees(Math.atan2(y, x));

    return (brng + 180) % 360;
  }

  stop() {
    clearInterval(this.intervalId);
  }
}
