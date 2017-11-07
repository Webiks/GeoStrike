import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { gunShotSubscription } from '../../../../../graphql/gun-shot.subscription';
import { Observable } from 'rxjs/Observable';
import { GunShots } from '../../../../../types';

@Injectable()
export class OtherPlayersShotService {

  constructor(private apollo: Apollo) { }

  public subscribeToGunShot(): Observable<GunShots.Subscription>{
    console.log('sub');
    return this.apollo.subscribe({
      query: gunShotSubscription,
    }).share();
  }


}
