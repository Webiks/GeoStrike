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
    console.log("toHeightOffset:"+cart.height);
    return Cesium.Cartesian3.fromRadians(cart.longitude, cart.latitude, cart.height);
  }

  toFixedHeight(cartesian, height = 0) {
    const cart = Cesium.Cartographic.fromCartesian(cartesian);
    cart.height = height;
    return Cesium.Cartesian3.fromRadians(cart.longitude, cart.latitude, cart.height);
  }
  isFlightHeightOkForLanding(curPosition){
    const currHeight =  Cesium.Cartographic.fromCartesian(curPosition).height;
    return Math.floor(currHeight) === Math.floor(this.character.meFromServer.flight.minHeight);
  }
  // getFlightHeightForGauge(curPosition){
  //   const currHeight =  Cesium.Cartographic.fromCartesian(curPosition).height;
  //   return Math.floor(currHeight) / Math.floor(this.character.meFromServer.flight.maxHeight);
  // }

  pointByLocationDistanceAndAzimuthAndHeight3d(currentLocation: any, meterDistance: number, radianAzimuth: number, isInputCartesian = true) {
    const distance = meterDistance / Cesium.Ellipsoid.WGS84.maximumRadius;
    const curLat = isInputCartesian ? Cesium.Cartographic.fromCartesian(currentLocation).latitude : currentLocation.latitude;
    const curLon = isInputCartesian ? Cesium.Cartographic.fromCartesian(currentLocation).longitude : currentLocation.longitude;
    const currHeight = isInputCartesian ? Cesium.Cartographic.fromCartesian(currentLocation).height : currentLocation.height;

    const destinationLat = Math.asin(
      Math.sin(curLat) * Math.cos(distance) +
      Math.cos(curLat) * Math.sin(distance) * Math.cos(radianAzimuth)
    );

    let destinationLon = curLon + Math.atan2(Math.sin(radianAzimuth) * Math.sin(distance) * Math.cos(curLat),
      Math.cos(distance) - Math.sin(curLat) * Math.sin(destinationLat)
    );

    const pitchDeg = this.character.pitch;
    const pitch = Cesium.Math.toRadians(pitchDeg);
    const heading = Cesium.Math.toRadians(-180 + this.character.heading);

    const heightCalculation = Math.sin(pitch) * (meterDistance);
    let destinationHeight;

    // currHeight += destinationHeight;


    if((currHeight + heightCalculation) >= this.character.meFromServer.flight.minHeight)
      destinationHeight = currHeight + heightCalculation;
    else
      destinationHeight = this.character.meFromServer.flight.minHeight;

    //
    // console.log("this.character.heading:"+this.character.heading);
    // // console.log("this.character.pitch:"+this.character.pitch);
    // // console.log("Math.sin(this.character.pitch):"+Math.sin(this.character.pitch));
    // console.log("Math.sin(this.character.heading):"+Math.sin(this.character.heading));
    //
    // console.log(" Math.sin(this.character.heading) * (meterDistance):"+ Math.sin(this.character.heading) * (meterDistance));
    // console.log("currHeight:"+currHeight)
    // console.log("destinationHeight:"+destinationHeight);


    destinationLon = (destinationLon + 3 * Math.PI) % (2 * Math.PI) - Math.PI;
    console.log("destinationHeight:"+destinationHeight);
    return Cesium.Cartesian3.fromRadians(destinationLon, destinationLat, destinationHeight);
  }


  calculateHeightLevel (flightData: FlightData, currentPosition: Cartesian3) {

    const heightRes = flightData.maxHeight - flightData.minHeight;
    const currHeight = Cesium.Cartographic.fromCartesian(currentPosition).height;
    const steps = 6;
    const heightStep = Math.ceil(heightRes / steps);
    const currHeightPerctange = currHeight/flightData.maxHeight;
    let currHeightLevel;
    if(currHeightPerctange <= 0.16)
      currHeightLevel  = 'A';
    else if(currHeightPerctange <= 0.32)
      currHeightLevel  = 'B';
    else if(currHeightPerctange <= 0.48)
      currHeightLevel  = 'C';
    else if(currHeightPerctange <= 0.64)
      currHeightLevel  = 'D';
    else if(currHeightPerctange <= 0.80)
      currHeightLevel  = 'E';
    else
      currHeightLevel  = 'MAX';
    return currHeightLevel;
  }
}
