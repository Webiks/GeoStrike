import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { EndGameDialogComponent } from '../end-game-dialog/end-game-dialog.component';
import { AuthorizationMiddleware } from '../../../core/configured-apollo/network/authorization-middleware';

@Component({
  selector: 'benched-dialog',
  templateUrl: './benched-dialog.component.html',
  styleUrls: ['./benched-dialog.component.scss']
})
export class BenchedDialogComponent implements OnInit {

  playerName;

  constructor(private modal: MatDialogRef<EndGameDialogComponent>,
              @Inject(MAT_DIALOG_DATA) data: { playerName: string}) {
    this.playerName = data.playerName;
  }

  ngOnInit() {
    document.onclick = undefined;
    document.exitPointerLock();

  }

  exitGame() {
    this.modal.close();
    AuthorizationMiddleware.removeToken();
    location.href = '/';
  }

  overview() {
    const toOverviewMode = true;
    this.modal.close(toOverviewMode);
  }

}
