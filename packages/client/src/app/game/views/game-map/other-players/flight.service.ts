import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs/Observable';
import { Flights } from '../../../../types';
import { flightSubscription } from '../../../../graphql/flightsSubscription';

@Injectable()
export class FlightService {
  flights$;
  constructor(private apollo:Apollo){

  }
  public subscribeAirTraffic(): Observable<Flights.Subscription> {
    if (!this.flights$){
      this.flights$ = this.apollo.subscribe( {
        query: flightSubscription
      }).share();
    }

    return this.flights$;
  }

}
