import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import {
  AcEntity,
  CesiumEvent,
  DisposableObservable,
  EventResult,
  MapEventsManagerService,
  MapsManagerService,
  PickOptions,
} from 'angular-cesium';
import { MatSnackBar } from '@angular/material';
import { PlayerFields } from '../../../../types';
import { TakeControlService } from '../../../services/take-control.service';

@Component({
  selector: 'viewer-controls',
  template: `
    <div class="control-container radius-border" *ngIf="isInFpvMode()|| takeControlService.selectedPlayerToControl">
      <div class="control-btn" [class.disable]="!takeControlService.controlledPlayer" (click)="removeControl()">VIEWER
      </div>
      <div class="control-btn radius-border"
           [class.disable]="isInFpvMode()|| !takeControlService.selectedPlayerToControl " (click)="takeControl()">PLAYER
      </div>
    </div>
  `,
  styleUrls: ['./viewer-controls.component.scss']
})
export class ViewerControlsComponent implements AfterViewInit, OnDestroy {

  private eventManager: MapEventsManagerService;
  private clickEvent: DisposableObservable<EventResult>;

  constructor(private mapsManager: MapsManagerService, private snackBar: MatSnackBar, public takeControlService: TakeControlService) {
  }

  ngOnInit() {

  }

  removeControl() {
    if (this.isInFpvMode()) {
      this.takeControlService.removePlayerControl();
    }
  }

  isInFpvMode(): boolean {
    return !!this.takeControlService.controlledPlayer;
  }

  takeControl() {
    if (this.takeControlService.selectedPlayerToControl && !this.isInFpvMode()) {
      this.takeControlService.controlPlayer(this.takeControlService.selectedPlayerToControl);
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.snackBar.open('Click on player icon to choose him', '', {duration: 3000}), 3000);

    this.eventManager = this.mapsManager.getMap().getMapEventsManager();

    this.clickEvent = this.eventManager.register({
      event: CesiumEvent.LEFT_CLICK,
      pick: PickOptions.PICK_ONE,
      entityType: AcEntity,
    });

    this.clickEvent
      .filter(result => result.entities && (result.entities[0] as PlayerFields.Fragment).type === 'PLAYER')
      .map(result => result.entities[0])
      .subscribe(selectedPlayer => {
        if (selectedPlayer.state !== 'DEAD'){
          const currentSelected = this.takeControlService.selectedPlayerToControl;
          if (currentSelected) {
            this.takeControlService.selectedPlayerToControl = currentSelected.id === selectedPlayer.id ? null : selectedPlayer;
          } else {
            this.takeControlService.selectedPlayerToControl = selectedPlayer;
          }
        }
      })
  }

  ngOnDestroy(): void {
    this.clickEvent.dispose();
  }

}
