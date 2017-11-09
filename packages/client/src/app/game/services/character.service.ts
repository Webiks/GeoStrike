import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { GameFields, PlayerFields, Team } from '../../types';
import { BuildingsService } from './buildings.service';
import { GameConfig } from './game-config';

export enum MeModelState {
  WALKING,
  RUNNING,
  SHOOTING,
  DEAD,
  CONTROLLED,
}

export enum ViewState {
  FPV,
  SEMI_FPV,
  OVERVIEW,
}

export interface CharacterState {
  id: string;
  location: any; // Cesium.Cartesian3
  heading: number;
  pitch: number;
  state: MeModelState;
  isCrawling: boolean;
  team: Team;
  characterInfo: PlayerFields.Character;
  tileBuilding: any;
  nearbyBuildingPosition: Cartesian3;
  enteringBuildingPosition: Cartesian3;
  enteredBuilding: any;
}

@Injectable()
export class CharacterService {
  private _character = new BehaviorSubject<CharacterState>(null);
  private _viewState = new BehaviorSubject<ViewState>(ViewState.SEMI_FPV);
  private _entity;
  private _meFromServer;

  constructor(private buildingsService: BuildingsService) {
  }

  get meFromServer() {
    return this._meFromServer;
  }

  set meFromServer(value) {
    this._meFromServer = value;
  }

  get entity() {
    return this._entity;
  }

  get initialized() {
    return this._character.getValue() !== null;
  }

  get viewState(): ViewState {
    return this._viewState.getValue();
  }

  get isCrawling() {
    return this._character.getValue().isCrawling;
  }

  set isCrawling(value: boolean) {
    this.modifyCurrentStateValue({
      isCrawling: value,
    });
  }

  set viewState(value: ViewState) {
    this._viewState.next(value);
  }

  get viewState$() {
    return this._viewState.asObservable();
  }

  initCharacter(state) {
    this._character.next({
      ...state,
    });
  }

  get state$() {
    return this._character.asObservable();
  }

  get location() {
    return this._character && this._character.getValue() && this._character.getValue().location;
  }

  get heading() {
    return this._character && this._character.getValue() && this._character.getValue().heading;
  }

  get pitch() {
    return this._character && this._character.getValue() && this._character.getValue().pitch;
  }

  get tileBuilding() {
    return this._character && this._character.getValue() && this._character.getValue().tileBuilding;
  }

  get nearbyBuildingPosition() {
    return this._character && this._character.getValue() && this._character.getValue().nearbyBuildingPosition;
  }

  get enteringBuildingPosition() {
    return this._character && this._character.getValue() && this._character.getValue().enteringBuildingPosition;
  }

  get enteredBuilding() {
    return this._character && this._character.getValue() && this._character.getValue().enteredBuilding;
  }

  get state(): MeModelState {
    return this._character && this._character.getValue() && this._character.getValue().state;
  }

  get currentStateValue(): CharacterState {
    return this._character.getValue();
  }

  private modifyCurrentStateValue(changes: any) {
    this._character.next({
      ...this.currentStateValue,
      ...changes,
    });
  }

  set entity(value) {
    this._entity = value;
  }

  set heading(value: number) {
    this.modifyCurrentStateValue({
      heading: value,
    });
  }

  set pitch(value: number) {
    this.modifyCurrentStateValue({
      pitch: value,
    });
  }

  set location(value: any) {
    let position = value;
    if (this.enteredBuilding) {
      const cartLocation = Cesium.Cartographic.fromCartesian(value);
      cartLocation.height = GameConfig.roomFloorHeightFromGround;
      position = Cesium.Cartesian3.fromRadians(cartLocation.longitude, cartLocation.latitude, cartLocation.height);
    }
    this.modifyCurrentStateValue({
      location: position,
    });
  }

  set tileBuilding(value: any) {
    this.modifyCurrentStateValue({
      tileBuilding: value,
    });
  }

  set nearbyBuildingPosition(value: any) {
    this.modifyCurrentStateValue({
      nearbyBuildingPosition: value,
    });
  }

  set enteringBuildingPosition(value: any) {
    this.modifyCurrentStateValue({
      enteringBuildingPosition: value,
    });
  }

  set enteredBuilding(value: any) {
    this.modifyCurrentStateValue({
      enteredBuilding: value,
    });
  }

  set state(value: MeModelState) {
    this.modifyCurrentStateValue({
      state: value,
    });
  }

  updateCharacter() {
    this.state = this.state;
  }

  public syncState(player: GameFields.Players) {
    if (this.initialized && player.syncState === 'INVALID') {
      this.location = player.currentLocation.location;
      this.heading = player.currentLocation.heading;
    }
  }

  public enterBuilding() {
    this.tileBuilding.show = false;
    this.enteringBuildingPosition = this.location;
    this.enteredBuilding = this.buildingsService.createBuilding(this.nearbyBuildingPosition);
    this.location = this.nearbyBuildingPosition;
    this.nearbyBuildingPosition = undefined;
  }

  public exitBuilding() {
    this.tileBuilding.show = true;
    this.enteredBuilding = undefined;
    this.location = this.enteringBuildingPosition;
    this.buildingsService.removeBuilding(this.enteredBuilding.id);
    this.tileBuilding = undefined;
    this.enteringBuildingPosition = undefined;
    this.nearbyBuildingPosition = undefined;
  }
}
