import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AuthorizationMiddleware } from '../../../core/configured-apollo/network/authorization-middleware';
import { Team } from '../../../types';

@Component({
  selector: 'end-game-dialog',
  templateUrl: './end-game-dialog.component.html',
  styleUrls: ['./end-game-dialog.component.scss']
})
export class EndGameDialogComponent implements OnInit {
  losingTeam: Team;
  gameOver = false;
  causeOfDeath: string;

  constructor(private modal: MatDialogRef<EndGameDialogComponent>,
              @Inject(MAT_DIALOG_DATA) data: { losingTeam: Team,causeOfDeath: string, gameOver: boolean,  }) {
    this.losingTeam = data.losingTeam;
    this.causeOfDeath = data.causeOfDeath;
    this.gameOver = data.gameOver;
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
