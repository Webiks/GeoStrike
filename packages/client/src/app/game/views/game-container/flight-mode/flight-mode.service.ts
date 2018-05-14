import { Injectable } from '@angular/core';
import { CharacterService, ViewState } from "../../../services/character.service";
import { UtilsService } from "../../../services/utils.service";
import { GameService } from "../../../services/game.service";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { FlightData } from "../../../../types";

@Injectable()
export class FlightModeService {

  constructor(private character:CharacterService, private utils:UtilsService , private gameService:GameService) { }
  isInFlightModeNotMoving = new BehaviorSubject<boolean>(true);
  currentFlightMode = this.isInFlightModeNotMoving.asObservable();

  changeFlyingState () {
    let isFlyStateUpdated = true;
    let flightData = this.character.flightData ? this.character.flightData : this.character.meFromServer.flight;
    if (this.character.viewState === ViewState.OVERVIEW ||  flightData.remainingTime <= 0) {
      return;
    }
    if(!this.character.isFlying){
      this.character.isFlying = true;
      this.character.flightData = flightData;
      this.character.location = this.utils.toHeightOffset(this.character.location, 50);
    }
    else
    {
      if(this.isFlightHeightOkForLanding(this.character.location, this.character.flightData)){
        this.character.isFlying = false;
        this.character.location = this.utils.toFixedHeight(this.character.location)
      }
      else {
        isFlyStateUpdated = false;
      }
    }
    return isFlyStateUpdated;
  }
  calculateHeightLevel (flightData: FlightData, currentPosition: Cartesian3, initalHeight: number = 0) {
    const heightRes = flightData.maxHeight - flightData.minHeight;
    const minHeight = flightData.minHeight;
    const currHeight = initalHeight == 0 ? Cesium.Cartographic.fromCartesian(currentPosition).height : initalHeight;
    const steps = 6;
    const heightStep = Math.ceil(heightRes / steps);
    let currHeightLevel;
    if(currHeight < minHeight || (Math.floor(currHeight) === Math.floor(minHeight - 15) || Math.floor(currHeight) === Math.floor(minHeight ) || Math.floor(currHeight) <= minHeight + heightStep))
      currHeightLevel  = 'A';
    else if(currHeight <= minHeight + (heightStep*2))
      currHeightLevel  = 'B';
    else if(currHeight <= minHeight + (heightStep*3))
      currHeightLevel  = 'C';
    else if(currHeight <= minHeight + (heightStep*4))
      currHeightLevel  = 'D';
    else if(currHeight <= minHeight + (heightStep*5))
      currHeightLevel  = 'E';
    else
      currHeightLevel  = 'MAX';
    return currHeightLevel;
  }

  isFlightHeightOkForLanding(curPosition, flightData){
    const currHeight =  Math.round(Cesium.Cartographic.fromCartesian(curPosition).height);
    const heightRes = flightData.maxHeight - flightData.minHeight;
    const steps = 6;
    const heightStep = Math.ceil(heightRes / steps);
    return Math.floor(currHeight) < Math.floor(this.character.flightData.minHeight) || (Math.floor(currHeight) <= Math.floor(this.character.flightData.minHeight + heightStep));
  }
}
