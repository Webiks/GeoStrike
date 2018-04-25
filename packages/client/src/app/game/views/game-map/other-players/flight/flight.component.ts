import {Component, OnInit, NgZone, OnDestroy, ChangeDetectorRef, Input, Output} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

import {AcEntity, AcNotification, ActionType, CesiumService} from 'angular-cesium';
import {FlightService} from '../flight.service';
import {CharacterService, ViewState} from '../../../../services/character.service';
import {UtilsService} from '../../../../services/utils.service';
import {InterpolationService, InterpolationType} from '../../../../services/interpolation.service';
import {Player, CharacterData, PlayerLocation, Location} from '../../../../../types'
import "rxjs/add/operator/take";


const config = {
  updateIntervalMs: 50,
};

@Component({
  selector: 'flight',
  templateUrl: './flight.component.html',
})
export class FlightComponent implements OnDestroy, OnInit {
  flightSubscription: Subscription;
  @Input() private flights$: Observable<AcNotification>;
  isOverview$: Observable<boolean>;
  listPlaneMap = new Map<string, any>();

  constructor(private flightService: FlightService,
              public character: CharacterService,
              private ngZone: NgZone,
              public utils: UtilsService,
              private cd: ChangeDetectorRef,
              private cesiumService: CesiumService) {
    this.isOverview$ = character.viewState$.map(viewState => viewState === ViewState.OVERVIEW);
  }

  ngOnInit() {
    // console.log(this.cesiumService.getScene()._primitives._primitives)
    console.log("init flight component");
    this.flightService.airTrafficQuery()
      .subscribe( (x) => {
        console.log(x);
        });
  }

  planeTypeModel(typeModel) {
    switch (typeModel) {
      case 1:
        return '/assets/models/planes/a318.glb';
      case 2:
        return '/assets/models/planes/atr42.glb';
      case 3:
        return '/assets/models/planes/plane.gltf';
      default:
        return '/assets/models/planes/plane.gltf';
    }
  }

  getOrientation(flight) {

    if (flight.state === 'DEAD') {
      // TODO: kill the Plane.
    } else {
      return this.utils.getOrientation(flight.currentLocation.location, flight.currentLocation.heading, 0, 0);
    }
  }

  VelocityVectorProperty(flight) {
    const flightId = flight.id;
    const positionProperty = this.listPlaneMap.get(flightId);
    return new Cesium.VelocityVectorProperty(positionProperty);
  }

  interpolatePosition(flight) {
    const flightId = flight.id;
    const positionProperty = this.listPlaneMap.get(flightId);
    if (!positionProperty) {
      const result = InterpolationService.interpolate({
        data: flight.currentLocation.location,
      }, InterpolationType.POSITION);
      this.listPlaneMap.set(flightId, result);
      return result;
    }
    else {
      // console.log(this.listPlaneMap.get(flightId));
      const newTime = Cesium.JulianDate.addSeconds(Cesium.JulianDate.now(), config.updateIntervalMs, new Cesium.JulianDate());
      const result = InterpolationService.interpolate({
        time: newTime,
        data: flight.currentLocation.location,
        cesiumSampledProperty: positionProperty,
      });
      return result;
    }
  }

  degreesToCartesian(location) {
    return new Cesium.Cartesian3.fromDegrees(location.x, location.y, location.z);
  }

  test(f) {
    console.log(f);
  }

  destinationPoint(lat, lon, distance, bearing) {
    let radius = 6371e3; // (Mean) radius of earth

    let toRadians = function(v) { return v * Math.PI / 180; };
    let toDegrees = function(v) { return v * 180 / Math.PI; };

    // sinφ2 = sinφ1·cosδ + cosφ1·sinδ·cosθ
    // tanΔλ = sinθ·sinδ·cosφ1 / cosδ−sinφ1·sinφ2
    // see mathforum.org/library/drmath/view/52049.html for derivation

    let δ = Number(distance) / radius; // angular distance in radians
    let θ = toRadians(Number(bearing));

    let φ1 = toRadians(Number(lat));
    let λ1 = toRadians(Number(lon));

    let sinφ1 = Math.sin(φ1), cosφ1 = Math.cos(φ1);
    let sinδ = Math.sin(δ), cosδ = Math.cos(δ);
    let sinθ = Math.sin(θ), cosθ = Math.cos(θ);

    let sinφ2 = sinφ1*cosδ + cosφ1*sinδ*cosθ;
    let φ2 = Math.asin(sinφ2);
    let y = sinθ * sinδ * cosφ1;
    let x = cosδ - sinφ1 * sinφ2;
    let λ2 = λ1 + Math.atan2(y, x);

    return [toDegrees(φ2), (toDegrees(λ2)+540)%360-180]; // normalise to −180..+180°
  }

  ngOnDestroy(): void {
    this.flightSubscription.unsubscribe();
  }
}
