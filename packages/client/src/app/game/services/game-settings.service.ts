import { Injectable } from '@angular/core';

@Injectable()
export class GameSettingsService {
  static serverUpdatingInterval = 200;
  static maxEnterableBuildingSize = 450;
  static minEnterableBuildingSize = 250;
}
