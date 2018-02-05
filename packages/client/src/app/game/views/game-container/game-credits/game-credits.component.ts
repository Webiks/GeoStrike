import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {CreditsDialogComponent} from "../../credits-dialog/credits-dialog.component";

@Component({
  selector: 'game-credits',
  templateUrl: './game-credits.component.html',
  styleUrls: ['./game-credits.component.scss']
})
export class GameCreditsComponent implements OnInit {

  constructor(private  dialog: MatDialog) {
  }

  ngOnInit() {
  }

  openCredits() {
    this.dialog.open(CreditsDialogComponent, {
      // height: '94%',
      height: '78%',
      width: '67%',
      panelClass: 'container-credits'
    } as MatDialogConfig)
  }

}
