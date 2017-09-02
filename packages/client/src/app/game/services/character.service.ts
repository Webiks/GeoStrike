import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export enum MeModelState {
  WALKING,
  RUNNING,
  LYING,
  SHOOTING,
}

export enum ViewState {
  FPV,
  SEMI_FPV,
}

export interface CharacterState {
  id: string;
  location: any; // Cesium.Cartesian3
  heading: number;
  pitch: number;
  state: MeModelState;
}

@Injectable()
export class CharacterService {
  private _character= new BehaviorSubject<CharacterState>(null);
  private _viewState = new BehaviorSubject<ViewState>(ViewState.SEMI_FPV);

  constructor() {
  }

  get initialized() {
    return this._character.getValue() !== null;
  }

  get viewState(): ViewState {
    return this._viewState.getValue();
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
    return this._character.getValue().location;
  }

  get heading() {
    return this._character.getValue().heading;
  }

  get pitch() {
    return this._character.getValue().pitch;
  }

  get state() : MeModelState {
    return this._character.getValue().state;
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
    this.modifyCurrentStateValue({
      location: value,
    });
  }

  set state(value: MeModelState) {
    this.modifyCurrentStateValue({
      state: value,
    });
  }
}
