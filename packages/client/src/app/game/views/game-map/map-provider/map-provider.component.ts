import { Component } from '@angular/core';
import { MapLayerProviderOptions } from 'angular-cesium';
import { GameService } from "../../../services/game.service";

const rectangle = Cesium.Rectangle.fromDegrees(
  5.013926957923385, 45.35600133779394, 11.477436312994008, 48.27502358353741);

const tillingScheme = new Cesium.GeographicTilingScheme({
  numberOfLevelZeroTilesX: 2,
  numberOfLevelZeroTilesY: 1
});

const terrainTypeProvider = {
  'SWISS': MapLayerProviderOptions.UrlTemplateImagery,
  'MOUNTAIN': MapLayerProviderOptions.BingMaps,
  'URBAN': MapLayerProviderOptions.BingMaps
}

const terrainTypeProviderOptions = {
  'SWISS': {
    url: '//wmts20.geo.admin.ch/1.0.0/ch.swisstopo.swissimage-product/default/current/4326/{z}/{x}/{y}.jpeg',
    minimumLevel: 8,
    maximumLevel: 17,
    tilingScheme: tillingScheme,
    rectangle: rectangle
  },
  'MOUNTAIN': {
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
