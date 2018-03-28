import {Component, OnInit, NgZone, OnDestroy, ChangeDetectorRef} from "@angular/core";
import {Subscription} from 'rxjs/Subscription';
import {Subject} from "rxjs/Subject";
import {Observable} from "rxjs/Observable";

import {AcEntity, AcNotification, ActionType} from "angular-cesium";
import {FlightService} from "../flight.service";
import {CharacterService, ViewState} from '../../../../services/character.service';
import {UtilsService} from "../../../../services/utils.service";
import {InterpolationService, InterpolationType} from "../../../../services/interpolation.service";

const config = {
  updateIntervalMs: 20,
};

@Component({
  selector: 'flight',
  templateUrl: './flight.component.html',
})
export class FlightComponent implements OnInit, OnDestroy {
  flightSubscription: Subscription;
  flights$: Subject<AcNotification> = new Subject<AcNotification>();
  isOverview$: Observable<boolean>;
  tempData;
  listPlanteMap = new Map<string, any>();

  constructor(private flightService: FlightService,
              public character: CharacterService,
              private ngZone: NgZone,
              public utils: UtilsService,
              private cd: ChangeDetectorRef) {
    this.isOverview$ = character.viewState$.map(viewState => viewState === ViewState.OVERVIEW);

  }

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      this.flightSubscription = this.flightService.subscribeAirTrafic()
        .subscribe((data) => {
          this.tempData = data;
          this.tempData.messageAdded.forEach(flight => {
            let location = {
              x: Number(flight.longitude),
              y: Number(flight.latitude),
              z: Number(flight.geo_altitude)
            }
            let mapping = {
              id: flight.icao24,
              model: '/assets/models/plane.gltf',
              scale: 1,
              orientation : this.utils.getOrientation(this.degreesToCartesian(location), 0),
              position: this.degreesToCartesian(location),
              image : '/assets/icons/plane.png',
              heading: flight.heading,
              state: "ALIVE",
            };

            const acMap = {
              id: flight.icao24,
              actionType: ActionType.ADD_UPDATE,
              entity: new AcEntity(mapping),

            };
            this.flights$.next(acMap);
          });

          this.cd.detectChanges();
        });
    });
  }

  degreesToCartesian(location) {
     return new Cesium.Cartesian3.fromDegrees(location.x, location.y, location.z);
   }

  getOrientation(flight) {

    if (flight.state === 'DEAD') {
      //TODO: kill the Plane.
    } else {
      return this.utils.getOrientation(flight.position, flight.heading, 0, 0);
    }
  }

  interpolatePosition (flight) {
    const flightId = flight.icao24;
    const positionProperty = this.listPlanteMap.get(flightId);

    if (!positionProperty) {
      const result = InterpolationService.interpolate({
        data: flight.position,
      }, InterpolationType.POSITION);
      this.listPlanteMap.set(flightId, result);
      return result;
    }
    else {
      let newTime = Cesium.JulianDate.addSeconds(Cesium.JulianDate.now(),config.updateIntervalMs, new Cesium.JulianDate());
      const result = InterpolationService.interpolate({
        time: newTime,
        data: flight.position,
        cesiumSampledProperty: positionProperty,
      });
      return result;
    }
  };


  ngOnDestroy(): void {
    this.flightSubscription.unsubscribe();
  }
}
