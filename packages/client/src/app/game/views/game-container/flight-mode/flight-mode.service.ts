import { Injectable } from '@angular/core';
import { CharacterService, ViewState } from "../../../services/character.service";
import { UtilsService } from "../../../services/utils.service";
import { GameService } from "../../../services/game.service";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

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
      if(this.utils.isFlightHeightOkForLanding(this.character.location, this.character.flightData)){
        this.character.isFlying = false;
        this.character.location = this.utils.toFixedHeight(this.character.location)
      }
      else {
        isFlyStateUpdated = false;
      }
    }
    return isFlyStateUpdated;
  }
}
