import { Component } from '@angular/core';
import { MapLayerProviderOptions } from 'angular-cesium';
import { GameService } from "../../../services/game.service";

const terrainTypeProvider = {
  'MOUNTAIN': MapLayerProviderOptions.BingMaps,
  'URBAN': MapLayerProviderOptions.BingMaps,
  'AUSTRALIA': MapLayerProviderOptions.BingMaps,
  'NEWZEALAND': MapLayerProviderOptions.BingMaps

}

const terrainTypeProviderOptions = {
  'MOUNTAIN': {
    url: 'https://dev.virtualearth.net',
    key: 'AkXEfZI-hKtZ995XgjM0XHxTiXpyS4i2Vb4w08Pjozwn-NAfVIvvHBYaP6Pgi717'
  },
  'AUSTRALIA': {
    url: 'https://dev.virtualearth.net',
    key: 'AkXEfZI-hKtZ995XgjM0XHxTiXpyS4i2Vb4w08Pjozwn-NAfVIvvHBYaP6Pgi717'
  },
  'NEWZEALAND': {
    url: 'https://dev.virtualearth.net',
    key: 'AkXEfZI-hKtZ995XgjM0XHxTiXpyS4i2Vb4w08Pjozwn-NAfVIvvHBYaP6Pgi717'
  },
  'URBAN': {
    url: 'https://dev.virtualearth.net',
    key: 'AkXEfZI-hKtZ995XgjM0XHxTiXpyS4i2Vb4w08Pjozwn-NAfVIvvHBYaP6Pgi717'
  }
}

@Component({
  selector: 'map-provider',
  templateUrl: './map-provider.component.html'
})

export class MapProviderComponent {
  options = {};
  mapLayerProviderOptions: MapLayerProviderOptions;

  constructor(private gameService: GameService) {
    this.gameService.currentTerrainEnviorment.subscribe(terrainType => {
      this.mapLayerProviderOptions = terrainTypeProvider[terrainType];
      this.options = terrainTypeProviderOptions[terrainType];
    });
  }
}
