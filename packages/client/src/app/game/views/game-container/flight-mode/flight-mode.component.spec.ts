import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FlightModeComponent} from './flight-mode.component';
import { CharacterService, CharacterState } from "../../../services/character.service";
import { UtilsService } from "../../../services/utils.service";
import { GameService } from "../../../services/game.service";
import { Observable } from "rxjs/Observable";
import { ActionType } from "angular-cesium";
import { FlightModeService } from "./flight-mode.service";
const entity = {
  flight : {
    speed: 'NONE',
    minHeight: 50,
    maxHeight: 500,
    remainingTime: 0, //300sec =  5min minutes in seconds
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
const characterServiceStub = {
  isFlying: true,
  location: {x: -1371108.6511167218, y: -5508684.080096612, z: 2901825.449865087},
  getIsFlying: function () {
    return this.isFlying;
  }
}

describe('FlightModeComponent', () => {
  let component: FlightModeComponent;
  let fixture: ComponentFixture<FlightModeComponent>;

  const gameServiceMock = jasmine.createSpyObj('GameService', ['getCurrentGameData']);
  gameServiceMock.getCurrentGameData.and.returnValue(Observable.of(
    gameData));

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FlightModeComponent],
      providers: [
        {provide: CharacterService, useValue: characterServiceStub},
        {provide: GameService, useValue: gameServiceMock}
        , UtilsService, FlightModeService]
    })
    fixture = TestBed.createComponent(FlightModeComponent);
    component = fixture.componentInstance;
  });
  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
  it('should be with remainging time', () => {
    fixture.detectChanges();
    expect(component.flightData.remainingTime > 0).toBeTruthy();
  });
  it('should be in current Flight Height bigger then zero', () => {
    fixture.detectChanges();
    expect(component.currentFlightHeight > 0);
  });
});
