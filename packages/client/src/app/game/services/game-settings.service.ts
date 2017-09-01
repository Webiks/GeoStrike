import { Injectable } from '@angular/core';

@Injectable()
export class GameSettingsService {
  static serverUpdateThrottle = 100;
  static fpsLimit = 60;
}
