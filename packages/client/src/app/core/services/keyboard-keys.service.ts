import { Injectable, NgZone } from '@angular/core';

export interface KeyboardInput {
  callback?: (event: KeyboardEvent) => void;
  description: string;
}

@Injectable()
export class KeyboardKeysService {

  eventMap: Map<string, KeyboardInput> = new Map();

  constructor(private ngZone: NgZone) {
  }

  getRegisteredKey(): Map<string, KeyboardInput> {
    return this.eventMap;
  }

  init() {
    this.ngZone.runOutsideAngular(() => {
      document.addEventListener('keydown', (keyEvent: KeyboardEvent) => {
        if (this.eventMap.has(keyEvent.code)) {
          const keyInput = this.eventMap.get(keyEvent.code);
          if (keyInput.callback) {
            keyInput.callback(keyEvent);
          }
        }
      });
    });
  }

  registerKeyBoardEvent(keyName: string, description: string, callback: (event: KeyboardEvent) => void) {
    this.eventMap.set(keyName, { callback, description });
  }

  registerKeyBoardEventDescription(keyName: string, description: string) {
    this.eventMap.set(keyName, { description });
  }

}
