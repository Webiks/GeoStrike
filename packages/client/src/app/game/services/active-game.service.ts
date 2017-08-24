import { Injectable } from '@angular/core';

@Injectable()
export class ActiveGameService {
  private _currentId: string = null;

  get current(): string {
    return this._currentId;
  }

  set current(value: string) {
    this._currentId = value;
  }
}
