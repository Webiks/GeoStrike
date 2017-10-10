import { Component, Inject, OnInit } from '@angular/core';
import { Team } from '../../../types';
import { AuthorizationMiddleware } from '../../../core/configured-apollo/network/authorization-middleware';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'you-win-dialog',
  templateUrl: './you-win-dialog.component.html',
  styleUrls: ['./you-win-dialog.component.scss']
})
export class YouWinDialogComponent implements OnInit {

  losingTeam: Team;

  constructor(private self : MatDialogRef<YouWinDialogComponent>,
              @Inject(MAT_DIALOG_DATA) data: {losingTeam: Team}) {
    this.losingTeam = data.losingTeam;
  }

  ngOnInit() {
    document.onclick = undefined;
    document.exitPointerLock();
  }

  exitGame() {
    this.self.close();
    AuthorizationMiddleware.removeToken();
    location.href = '/';
  }
}
