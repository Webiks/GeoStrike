import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material';
import {window} from "rxjs/operator/window";

@Component({
  selector: 'credits-dialog',
  templateUrl: './credits-dialog.component.html',
  styleUrls: ['./credits-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CreditsDialogComponent{

  constructor(public dialog: MatDialog) {
  }
}
