import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export enum MeModelState {
  WALKING,
  RUNNING,
  LYING,
  SHOOTING,
}

export interface CharacterState {
  id: string;
  location: any; // Cesium.Cartesian3
  heading: number;
  state: MeModelState;
}

@Injectable()
export class CharacterService {
  private _character: BehaviorSubject<CharacterState> = null;

  constructor() {
  }

  get initialized() {
    return this._character !== null;
  }

  initCharacter(state) {
    this._character = new BehaviorSubject<CharacterState>(state);
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

  get state() {
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
