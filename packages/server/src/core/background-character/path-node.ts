import { Location } from '../../types';

export class PathNode {
  location: Location;
  id: string;
  points: [PathNode];
}


const loadPath = () => {

  const pathsJson = require('../../settings/background-characters-path.json');
  const pathsMap: Map<string, any> = new Map();

  pathsJson.forEach(jsonPath => pathsMap.set(jsonPath.id, jsonPath));
  for (let [id, pathNode] of pathsMap) {
    pathNode.points = pathNode.points.map(pointId => pathsMap.get(pointId));
  }

  const pathGraph =  Array.from(pathsMap.values());
  return pathGraph as [PathNode];
};

export const pathsGraph: [PathNode] = loadPath();



