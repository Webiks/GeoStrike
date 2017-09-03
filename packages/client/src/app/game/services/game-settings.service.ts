import { Injectable } from '@angular/core';

@Injectable()
export class GameSettingsService {
  static serverClientDistanceThreshold = 0.001;
  static serverUpdatingRate = 50;
}
