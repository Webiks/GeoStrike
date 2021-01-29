import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs/Observable';
import { beenShotSubscription } from "../../../../graphql/been-shot.subscription";
import { BeenShots } from "../../../../types";

@Injectable()
export class BeenShotService {

  beenShots$;

  constructor(private apollo: Apollo) {
  }

  public subscribeToBeenShot(): Observable<BeenShots.Subscription> {
      this.beenShots$ = this.apollo.subscribe({
        query: beenShotSubscription,
      }).share();
    return this.beenShots$;
  }

}
