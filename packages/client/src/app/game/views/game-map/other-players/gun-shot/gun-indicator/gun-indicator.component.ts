import { Component, OnDestroy, OnInit } from '@angular/core';
import { CharacterService, ViewState } from '../../../../../services/character.service';
import { Observable } from 'rxjs/Observable';
import { AcNotification, ActionType } from 'angular-cesium';
import { OtherPlayersShotService } from '../other-players-shot.service';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'gun-indicator',
  templateUrl: './gun-indicator.component.html',
  styleUrls: ['./gun-indicator.component.scss']
})
export class GunIndicatorComponent implements OnInit, OnDestroy {

  gunShots$: Subject<AcNotification> = new Subject();
  gunShotSubscription: Subscription;
  isOverview$: Observable<boolean>;

  constructor(private character: CharacterService,
              private otherPlayersShotService: OtherPlayersShotService) {
    this.isOverview$ = character.viewState$.map(viewState => viewState === ViewState.OVERVIEW);
    this.gunShotSubscription = this.otherPlayersShotService.subscribeToGunShot()
      .map(result => result.gunShot)
      .do(gunShotData => this.removeIndicatorTimer(gunShotData))
      .map(gunShotData => {
        return {
          id: gunShotData.id,
          actionType: ActionType.ADD_UPDATE,
          entity: gunShotData,
        }
      })
      .do(x=>console.log(x))
      .subscribe(shotEntity => this.gunShots$.next(shotEntity))
  }

  private removeIndicatorTimer(gunShotData) {
    // setTimeout(()=>{
    //   this.gunShots$.next({
    //     id: gunShotData.id,
    //     actionType: ActionType.DELETE,
    //   })
    // }, 1000);
  }

  ngOnDestroy(): void {
    this.gunShots$.unsubscribe();
    this.gunShotSubscription.unsubscribe();
  }


  getGunImage(){
    return '/assets/icons/gun-marker.png';
  }

  ngOnInit() {
  }

}
