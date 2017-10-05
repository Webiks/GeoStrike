import { Component } from '@angular/core';
import { MdDialog, MdSnackBar } from '@angular/material';
import { JoinGameDialogComponent } from '../join-game-dialog/join-game-dialog.component';
import { CreateNewGameDialogComponent } from '../create-new-game-dialog/create-new-game-dialog.component';

@Component({
  selector: 'main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent {
  characterName;
  username = 'Anonymous User';
  constructor(private dialog: MdDialog,
              private snackBar: MdSnackBar) {
  }


  openCreateGameDialog() {
    if (this.validateInput()){
      this.dialog.open(CreateNewGameDialogComponent, {
        height: '100%',
        width: '100%',
         panelClass: 'general-dialog'
      });
    }
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

  validateInput(){
    if (!this.characterName || !this.username){
      this.snackBar.open('Please pick a Character and Username','OK', {duration: 3000});
      return false;
    }
    return true;

  }
}
