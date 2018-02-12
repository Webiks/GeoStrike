import {Component} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {CreditsDialogComponent} from "../../credits-dialog/credits-dialog.component";

@Component({
  selector: 'game-credits',
  templateUrl: './game-credits.component.html',
  styleUrls: ['./game-credits.component.scss']
})
export class GameCreditsComponent {

  constructor(private  dialog: MatDialog) {
  }

  openCredits() {
    this.dialog.open(CreditsDialogComponent, {
      height: '78%',
      width: '67%',
      panelClass: 'container-credits'
    } as MatDialogConfig)
  }

}
