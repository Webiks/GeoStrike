/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

declare var Cesium;

interface Cartesian3 {
  x: number;
  y: number;
  z: number;
}

interface Cartesian2 {
  x: number;
  y: number;
}
