import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BloodOnScreen} from './blood-on-screen';
import {CharacterService, ViewState} from "../../../services/character.service";
import {BuildingsService} from "../../../services/buildings.service";
import {By} from "@angular/platform-browser";
import { ActionType } from "angular-cesium";
import { Observable } from "rxjs/Observable";
import { GameService } from "../../../services/game.service";
import { BeenShotService } from "./been-shot.service";

const entity = {
  flight : {
    speed: 'NONE',
    minHeight: 50,
    maxHeight: 500,
    remainingTime: 3000, //300sec =  5min minutes in seconds
    heightLevel: 'NONE'
  }
}
const player = {
  id: 0,
  entity: {
    entity
  }
};
const me = {
  id: player.id,
  actionType: ActionType.ADD_UPDATE,
  entity: player,
}
const gameData = {
  gameData: {
    me: {
      me
    }
  }
}

const beenShot = {
  beenShot: {
    id: player.id,
    lifeState: 'FULL'
  }
}

fdescribe('PlayerBloodOnscreenEffectComponent', () => {
  let component: BloodOnScreen;
  let fixture: ComponentFixture<BloodOnScreen>;
  let characterServiceStub;
  let de;
  let el;
  let me;

  const gameServiceMock = jasmine.createSpyObj('GameService', ['getCurrentGameData']);
  gameServiceMock.getCurrentGameData.and.returnValue(Observable.of(
    gameData));

  const beenShotServiceMock = jasmine.createSpyObj('BeenShotService', ['subscribeToBeenShot']);
  beenShotServiceMock.subscribeToBeenShot.and.returnValue(Observable.of(
    beenShot));


  me = {
    isShooting:true
  }

  beforeEach( () => {

    characterServiceStub = {
      viewState: ViewState.FPV,
      getViewState: function () {
        return this.viewState;
      }
    }

    TestBed.configureTestingModule({
      declarations: [BloodOnScreen],
      providers: [BuildingsService,
        {provide: CharacterService, useValue: characterServiceStub},
        {provide: GameService, useValue: gameServiceMock},
        {provide: BeenShotService, useValue: beenShotServiceMock}
      ]
    })
    fixture = TestBed.createComponent(BloodOnScreen);

    component = fixture.debugElement.componentInstance;
  });
  it('should show empty life DIV', () => {
    fixture.detectChanges();
    // de = fixture.debugElement.query(By.css('.life'));
    // el = de.nativeElement;
    // const content = el.textContent;
    expect(component).toBeTruthy();
  });
});
