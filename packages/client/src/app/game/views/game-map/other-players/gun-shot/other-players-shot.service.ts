import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs/Observable';
import { GunShots } from '../../../../../types';
import { gunShotSubscription } from '../../../../../graphql/subscription/gun-shot.subscription';

@Injectable()
export class OtherPlayersShotService {

  gunShots$;

  constructor(private apollo: Apollo) {
  }

  public subscribeToGunShot(): Observable<GunShots.Subscription> {

    if (!this.gunShots$) {
      this.gunShots$ = this.apollo.subscribe({
        query: gunShotSubscription,
      }).share();
    }
    return this.gunShots$;
  }


}
