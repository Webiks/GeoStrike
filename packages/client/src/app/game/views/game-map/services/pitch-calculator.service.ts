import { Injectable } from '@angular/core';
import { CharacterService, ViewState } from '../../../services/character.service';

@Injectable()
export class PitchCalculatorService {

  constructor(private character: CharacterService) { }


  calcAndSetNewPitch(oldPitch, newPitch): void {
    const isSemiFpv = this.character.viewState === ViewState.SEMI_FPV;
    const isCrawling = this.character.isCrawling;
    const isFlying = this.character.isFlying;
    let maxPitch = isFlying ? 45 :  80.0 ;
    let minPitch = isCrawling ? (-55) : (isFlying) ? -45: -80;
    if (isSemiFpv){
      maxPitch = isCrawling ? 2 : 25.0;
      minPitch = isCrawling ? -50 : -80;
    }

    if (newPitch < minPitch) {
      newPitch = minPitch;
    }
    else if (newPitch > maxPitch) {
      newPitch = maxPitch;
    }

    if (newPitch !== oldPitch){
      this.character.pitch = newPitch;
    }
  }

  calcAndSetNewHeading(oldHeading, newHeading): void {

    if (newHeading !== oldHeading){
      this.character.heading = newHeading;
    }
  }

}
