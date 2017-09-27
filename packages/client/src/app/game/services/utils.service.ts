import { Injectable } from '@angular/core';

@Injectable()
export class UtilsService {

  constructor() { }

  getClampedToGroundHeightReference() {
    return Cesium.HeightReference.CLAMP_TO_GROUND;
  }

  getOrientation(location, heading = 0, pitch = 0, roll = 0) {
    const headingC = Cesium.Math.toRadians(heading);
    const pitchC = Cesium.Math.toRadians(pitch);
    const rollC = Cesium.Math.toRadians(roll);
    const hpr = new Cesium.HeadingPitchRoll(headingC, pitchC, rollC);

    return Cesium.Transforms.headingPitchRollQuaternion(this.getPosition(location), hpr);
  }

  getPosition(location) {
    const { x, y, z } = location;

    return new Cesium.Cartesian3(x, y, z);
  }

  getModelDisplayCondition(){
    return  new Cesium.DistanceDisplayCondition(0.0, 125.5);
  }

  getIconDisplayCondition(){
    return  new Cesium.DistanceDisplayCondition(125.5);
  }

  toFixedHeight(cartesian){
    const cart = Cesium.Cartographic.fromCartesian(cartesian);
    cart.height = 10;
    return Cesium.Cartesian3.fromRadians(cart.longitude, cart.latitude, cart.height);

  }
}
