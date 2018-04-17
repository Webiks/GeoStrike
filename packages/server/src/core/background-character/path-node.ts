import { Location } from '../../types';

enum JsonType {
    CAR = 'car',
    PEOPLE = 'people',
    DEER = 'deer',
    RHINO = 'rhino',
    INDIANWOMAN = 'indianWoman'
}

export class PathNode {
    location: Location;
    id: string;
    points: [PathNode];
}

const loadPath = (type: JsonType) => {
    const pathsJson = require(`../../settings/background-characters-path-${type}.json`);
    const pathsMap: Map<string, any> = new Map();

    pathsJson.forEach(jsonPath => pathsMap.set(jsonPath.id, jsonPath));
    for (const [id, pathNode] of pathsMap) {
        pathNode.points = pathNode.points.map(pointId => pathsMap.get(pointId));
    }

    const pathGraph = Array.from(pathsMap.values());
    return pathGraph as [PathNode];
};

const peoplePathsGraph: [PathNode] = loadPath(JsonType.PEOPLE);
const carsPathsGraph: [PathNode] = loadPath(JsonType.CAR);
const deerssPathsGraph: [PathNode] = loadPath(JsonType.DEER);
const rhinosPathsGraph: [PathNode] = loadPath(JsonType.RHINO);
const indinanWomanPathsGraph: [PathNode] = loadPath(JsonType.INDIANWOMAN);


export const PATHS_GRAPHS = {
    CAR: carsPathsGraph,
    PEOPLE: peoplePathsGraph,
    DEER: deerssPathsGraph,
    RHINO: rhinosPathsGraph,
    INDIANWOMAN: indinanWomanPathsGraph
};
