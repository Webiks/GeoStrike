import {Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {Observable} from 'rxjs/Observable';
import {Flights} from '../../../../types';
import {flightSubscription} from '../../../../graphql/subscription/flights.Subscription';
import {airTrafficQuery} from '../../../../graphql/mutation/airTraffic.query';


@Injectable()
export class FlightService {
  flights$;

  constructor(private apollo: Apollo) {

  }

  public subscribeAirTraffic(): Observable<Flights.Subscription> {
    if (!this.flights$) {
      this.flights$ = this.apollo.subscribe({
        query: flightSubscription
      });
    }
    // console.log("subscribeAirTraffic");
    return this.flights$;
  }

  public airTrafficQuery(): Observable<any> {
    console.log("airTrafficQuery");
    return this.apollo.mutate<any>({
      mutation: airTrafficQuery
    });
  }


}
