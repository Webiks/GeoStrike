import {FlightService} from '../flight.service';
import {Subscription} from 'rxjs/Subscription';
import {Component, OnInit, NgZone, OnDestroy, ChangeDetectorRef, Input} from "@angular/core";
import {UtilsService} from '../../../../services/utils.service';
import {CharacterService, ViewState} from '../../../../services/character.service';
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import {AcEntity, AcNotification, ActionType, CesiumService} from "angular-cesium";
import {InterpolationService, InterpolationType} from "../../../../services/interpolation.service";
import {Flights} from "../../../../../types";
import {flightSubscription} from "../../../../../graphql/flightsSubscription";

@Component({
  selector: 'flight',
  templateUrl: './flight.component.html',
})

export class FlightComponent implements OnInit, OnDestroy {


  flightSubscription: Subscription;
  flights$: Subject<AcNotification> = new Subject<AcNotification>();
  isOverview$: Observable<boolean>;
  allFlights: any [] = [];
  tempData;
  listPlanteMap = new Map<string, any>();
  prim;

  constructor(private flightService: FlightService,
              public character: CharacterService,
              private ngZone: NgZone,
              public utils: UtilsService,
              private cd: ChangeDetectorRef,
              private cesiumService: CesiumService) {
    this.isOverview$ = character.viewState$.map(viewState => viewState === ViewState.OVERVIEW);

  }

  ngOnInit() {

    this.ngZone.runOutsideAngular(() => {
      this.flightSubscription = this.flightService.subscribeAirTrafic()
        .subscribe((data) => {

          this.tempData = data;
          this.tempData.messageAdded.forEach(flight => {

            const p = this.listPlanteMap.get(flight.icao24);

            if(!p){
              let newFlight = {
                icao24: flight.icao24,
                velocity: flight.velocity,             // Speed
                heading: flight.heading,               // Head position.
                geo_altitude: flight.geo_altitude,     // Height from ground.
                location: {
                  x: Number(flight.longitude),
                  y: Number(flight.latitude),
                  z: Number(flight.geo_altitude)
                }
                // location: new Cesium.Cartesian3.fromDegrees(Number(flight.longitude),Number(flight.latitude), Number(flight.geo_altitude))
              };
              this.allFlights.push(newFlight);
              this.listPlanteMap.set(flight.icao24,newFlight);

            } else {
              this.allFlights.reduce(
                (ds, d)=> {
                  let newD = d;
                  if(d.icao24 === p){
                    newD = Object.assign({},d, {
                      velocity: flight.velocity,
                      heading: flight.heading,
                      geo_altitude: flight.geo_altitude,
                      location: {
                        x: Number(flight.longitude),
                        y: Number(flight.latitude),
                        z: Number(flight.geo_altitude)
                      },})
                  }
                  return ds.concat(newD);
                },[]);
            }
            });

          this.cd.detectChanges();
          this.drawFlight();
        });
    });
  }

  drawFlight() {

    this.allFlights.forEach(flight => {
      let mapping = {
        model: '/assets/models/plane.gltf',
        scale: 1,
        // orientation : this.utils.getOrientation(flight.location, flight.heading),
        orientation : this.utils.getOrientation(this.degreesToCartesian(flight.location), flight.heading),
        position: flight.location,
        image : '/assets/icons/plane.png',
        heading: flight.heading,
        velocity: flight.velocity,
      };

      // const acMap = {
      //   id: flight.icao24,
      //   actionType: ActionType.ADD_UPDATE,
      //   entity: new AcEntity(planePrimitive),
      //   // entity: new AcEntity(mapping),
      //
      // };
      // this.flights$.next(acMap);
      this.movingModle(flight);

      ////////


    });
  }


  degreesToCartesian(location) {
    return new Cesium.Cartesian3.fromDegrees(location.x, location.y, location.z);

  }

  movingModle(flight) {
    const hpRoll = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(flight.heading),0,0);
    let speed = Cesium.Math.toRadians(flight.velocity/100);
    const fixedFrameTransform = Cesium.Transforms.localFrameToFixedFrameGenerator('north', 'west');
    let speedVector = new Cesium.Cartesian3();
    let position = this.degreesToCartesian(flight.location);
    const pathPosition = new Cesium.SampledPositionProperty();

    const planePrimitive = (Cesium.Model.fromGltf({
      url: '/assets/models/plane.gltf',
      modelMatrix: Cesium.Transforms.headingPitchRollToFixedFrame(position, hpRoll, Cesium.Ellipsoid.WGS84, fixedFrameTransform),
      minimumPixelSize: 128,
      id: flight.icao24,
    }));

    this.prim = this.cesiumService.getScene();
    this.prim.primitives._primitives.forEach(x => {
      if(x.id===flight.icao24){
        x.destroy();
      }});
    this.prim.primitives["_primitives"].push(planePrimitive);

    // console.log(this.prim.primitives["_primitives"]);
    // console.log(planePrimitive);

    this.prim.preRender.addEventListener(
      () => {
        // console.log(`plane:${flight.icao24}, speed:${speed}`);
        speedVector = Cesium.Cartesian3.multiplyByScalar(Cesium.Cartesian3.UNIT_X,  speed, speedVector);
        position = Cesium.Matrix4.multiplyByPoint(planePrimitive.modelMatrix, speedVector, this.degreesToCartesian(flight.location));
        pathPosition.addSample(Cesium.JulianDate.now(), position);
        Cesium.Transforms.headingPitchRollToFixedFrame(position, hpRoll, Cesium.Ellipsoid.WGS84, fixedFrameTransform, planePrimitive.modelMatrix);
      });

  }

  destinationPoint(lat, lon, distance, bearing, geo_altitude) {
    let radius = 6371e3; // (Mean) radius of earth

    let toRadians = function (v) {
      return v * Math.PI / 180;
    };
    let toDegrees = function (v) {
      return v * 180 / Math.PI;
    };

    let δ = Number(distance) / radius; // angular distance in radians
    let θ = toRadians(Number(bearing));

    let φ1 = toRadians(Number(lat));
    let λ1 = toRadians(Number(lon));

    let sinφ1 = Math.sin(φ1), cosφ1 = Math.cos(φ1);
    let sinδ = Math.sin(δ), cosδ = Math.cos(δ);
    let sinθ = Math.sin(θ), cosθ = Math.cos(θ);

    let sinφ2 = sinφ1 * cosδ + cosφ1 * sinδ * cosθ;
    let φ2 = Math.asin(sinφ2);
    let y = sinθ * sinδ * cosφ1;
    let x = cosδ - sinφ1 * sinφ2;
    let λ2 = λ1 + Math.atan2(y, x);

    return [toDegrees(φ2), (toDegrees(λ2) + 540) % 360 - 180, geo_altitude]; // normalise to −180..+180°
  }

  ngOnDestroy(): void {
    this.flightSubscription.unsubscribe();
  }
}

