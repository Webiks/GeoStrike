import { Injectable } from '@angular/core';
import { CharacterService } from './character.service';
import { FlightData } from "../../types";

@Injectable()
export class UtilsService {

  constructor(private character: CharacterService) {
  }

  getClampedToGroundHeightReference() {
    return Cesium.HeightReference.CLAMP_TO_GROUND;
  }

  getRelativeToGroundHeightReference() {
    return Cesium.HeightReference.RELATIVE_TO_GROUND;
  }
  getAbsoluteToGroundHeightReference() {
    return Cesium.HeightReference.NONE;
  }

  getOrientation(location, heading = 0, pitch = 0, roll = 0) {
    const headingC = Cesium.Math.toRadians(heading);
    const pitchC = Cesium.Math.toRadians(pitch);
    const rollC = Cesium.Math.toRadians(roll);
    const hpr = new Cesium.HeadingPitchRoll(headingC, pitchC, rollC);

    return Cesium.Transforms.headingPitchRollQuaternion(this.getPosition(location), hpr);
  }

  getPosition(location) {
    const {x, y, z} = location;
    return new Cesium.Cartesian3(x, y, z);
  }

  toHeightOffset(position: Cartesian3, offset: number, flightHeight: number = 0){
    const cart = Cesium.Cartographic.fromCartesian(position);
    if(flightHeight === 0)
      cart.height += offset;
    else
      cart.height = flightHeight + offset;
    return Cesium.Cartesian3.fromRadians(cart.longitude, cart.latitude, cart.height);
  }

  toFixedHeight(cartesian, height = 0) {
    const cart = Cesium.Cartographic.fromCartesian(cartesian);
    cart.height = height;
    return Cesium.Cartesian3.fromRadians(cart.longitude, cart.latitude, cart.height);
  }


  pointByLocationDistanceAndAzimuthAndHeight3d(currentLocation: any, meterDistance: number, radianAzimuth: number, isInputCartesian = true) {
    const distance = meterDistance / Cesium.Ellipsoid.WGS84.maximumRadius;
    const curLat = isInputCartesian ? Cesium.Cartographic.fromCartesian(currentLocation).latitude : currentLocation.latitude;
    const curLon = isInputCartesian ? Cesium.Cartographic.fromCartesian(currentLocation).longitude : currentLocation.longitude;
    const currHeight = isInputCartesian ? Cesium.Cartographic.fromCartesian(currentLocation).height : currentLocation.height;
    const pitchDeg = this.character.pitch;
    const pitch = Cesium.Math.toRadians(pitchDeg);
    const heightCalculation = Math.sin(pitch) * (meterDistance);
    const destinationLat = Math.asin(
      Math.sin(curLat) * Math.cos(distance) +
      Math.cos(curLat) * Math.sin(distance) * Math.cos(radianAzimuth)
    );
    let destinationLon = curLon + Math.atan2(Math.sin(radianAzimuth) * Math.sin(distance) * Math.cos(curLat),
      Math.cos(distance) - Math.sin(curLat) * Math.sin(destinationLat)
    );
    let destinationHeight;

    destinationHeight = currHeight + heightCalculation;
    destinationLon = (destinationLon + 3 * Math.PI) % (2 * Math.PI) - Math.PI;
    return Cesium.Cartesian3.fromRadians(destinationLon, destinationLat, destinationHeight);
  }

  getIconPosition(player, height){
    if(this.character.isFlying){
      return this.toHeightOffset(player.currentLocation.location, 50);
    }
    else{
      return this.toFixedHeight(player.currentLocation.location, 5);
    }
  }
}
