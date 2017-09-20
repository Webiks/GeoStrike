import { Location } from '../../types';

export class PathNode {
  location: Location;
  id: string;
  points: [PathNode];
}


export const loadPath = () => {

  const pathsJson = require('../../settings/background-characters-path.json');
  const pathsGraph: [PathNode] = [] as [PathNode];
  const pathsMap: Map<string, PathNode> = new Map();

  pathsJson.forEach(jsonPath => pathsMap.set(jsonPath.id, jsonPath));
  pathsJson.forEach(jsonPath => {
    const pathWithPoints: PathNode = {...jsonPath};
    pathWithPoints.points = [] as [PathNode];
    jsonPath.points.forEach(pointId => pathWithPoints.points.push(pathsMap.get(pointId)));

    pathsGraph.push(pathWithPoints);
  });

  return pathsGraph;
};



