import { Component } from '@angular/core';
import { MdDialog } from '@angular/material';
import { JoinGameDialogComponent } from '../join-game-dialog/join-game-dialog.component';
import { CreateNewGameDialogComponent } from '../create-new-game-dialog/create-new-game-dialog.component';

@Component({
  selector: 'main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent {
  characterName;
  username = 'Anonymous'
  constructor(private dialog: MdDialog) {
  }


  openCreateGameDialog() {
    this.dialog.open(CreateNewGameDialogComponent, {
      height: '100%',
      width: '100%',
       panelClass: 'general-dialog'
    });
  }

  openJoinGameDialog() {
    this.dialog.open(JoinGameDialogComponent, {
      height: '100%',
      width: '100%',
      panelClass: 'general-dialog'
    });
  }


  characterChanged({name, team}) {
    this.characterName = name;
  }
}
