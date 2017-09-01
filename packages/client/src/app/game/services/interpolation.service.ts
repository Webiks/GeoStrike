import { Injectable } from '@angular/core';

export interface InterpolationInput {
  data: any;
  time?: Date;
  cesiumSampledProperty?: any;
  interpolationOptions?: any;
}

export enum InterpolationType {
  POSITION = Cesium.SampledPositionProperty,
  GENERAL = Cesium.SampledProperty,
}

@Injectable()
export class InterpolationService {
  static interpolate(input: InterpolationInput, interpolationType = InterpolationType.GENERAL) {
    const time = input.time ? Cesium.JulianDate.fromDate(input.time) : Cesium.JulianDate.now();
    const interpolationOptions = input.interpolationOptions || { interpolationDegree: 1, interpolationAlgorithm: Cesium.LinearApproximation };
    const cesiumSampledProperty = input.cesiumSampledProperty || new (interpolationType as any)();
    if(input.cesiumSampledProperty){
      cesiumSampledProperty.forwardExtrapolationType = Cesium.ExtrapolationType.HOLD;
      cesiumSampledProperty.forwardExtrapolationDuration = 0;
      cesiumSampledProperty.backwardExtrapolationType = Cesium.ExtrapolationType.HOLD;
      cesiumSampledProperty.backwardExtrapolationDuration = 0;
      cesiumSampledProperty.setInterpolationOptions(interpolationOptions);
    }
    cesiumSampledProperty.addSample(time, input.data);
    return cesiumSampledProperty;
  }

  constructor(){}
}
