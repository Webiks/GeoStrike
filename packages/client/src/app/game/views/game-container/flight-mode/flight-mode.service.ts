import { Injectable } from '@angular/core';
import { CharacterService, ViewState } from "../../../services/character.service";
import { UtilsService } from "../../../services/utils.service";
import { GameService } from "../../../services/game.service";

@Injectable()
export class FlightModeService {

  constructor(private character:CharacterService, private utils:UtilsService , private gameService:GameService) { }


  changeFlyingState () {
    let isFlyStateUpdated = true;
    if (this.character.viewState === ViewState.OVERVIEW) {
      return;
    }
    if(!this.character.isFlying){
      this.character.isFlying = true;
      this.character.flightData = this.character.meFromServer.flight;
      this.character.location = this.utils.toHeightOffset(this.character.location, 195);
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
    // this.gameService.updateServerOnPosition(true);
    // const flightSubscription = this.gameService.toggleFlightMode(this.character.meFromServer.id, this.character.isFlying).subscribe(() => flightSubscription.unsubscribe());
  }
}
