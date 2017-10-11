import { AfterViewInit, Component, Input, OnDestroy } from '@angular/core';
import {
  AcEntity,
  AcNotification,
  ActionType,
  CesiumEvent,
  DisposableObservable,
  EventResult,
  MapEventsManagerService,
  MapsManagerService,
  PickOptions,
} from 'angular-cesium';
import { MatSnackBar } from '@angular/material';
import { PlayerFields } from '../../../../types';
import { Subject } from 'rxjs/Subject';
import { TakeControlService } from '../../../services/take-control.service';

@Component({
  selector: 'viewer-controls',
  template: `
    <div class="control-container radius-border">
      <div class="control-btn" [class.disable]="true">VIEWER</div>
      <div class="control-btn radius-border" [class.disable]="!takeControlService.selectedPlayerToControl" (click)="takeControl()">PLAYER</div>
    </div>
  `,
  styleUrls: ['./viewer-controls.component.scss']
})
export class ViewerControlsComponent implements AfterViewInit, OnDestroy {
  @Input()
  players: Subject<AcNotification>;


  private eventManager: MapEventsManagerService;
  private clickEvent: DisposableObservable<EventResult>;

  constructor(private mapsManager: MapsManagerService, private snackBar: MatSnackBar, public takeControlService: TakeControlService) {
  }

  ngOnInit() {

  }

  takeControl() {
    if (this.takeControlService.selectedPlayerToControl) {
      this.takeControlService.controlPlayer(this.takeControlService.selectedPlayerToControl);
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.snackBar.open('Click on player icon to choose him', '', {duration: 2000}), 3000);

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

        const currentSelected = this.takeControlService.selectedPlayerToControl;
        if (currentSelected) {
          selectedPlayer.selected = currentSelected.id === selectedPlayer.id ? !(currentSelected as any).selected : true;
        } else {
          selectedPlayer.selected = true;
        }

        this.takeControlService.selectedPlayerToControl = selectedPlayer.selected ? selectedPlayer : null;
        this.players.next({
          id: selectedPlayer.id,
          entity: selectedPlayer,
          actionType: ActionType.ADD_UPDATE,
        })
      })
  }

  ngOnDestroy(): void {
    this.clickEvent.dispose();
  }

}
