import { Component, Input, OnInit } from '@angular/core';
import { YouWinDialogComponent } from '../../you-win-dialog/you-win-dialog.component';
import { Team } from '../../../../types';
import { EndGameDialogComponent } from '../../end-game-dialog/end-game-dialog.component';
import { CharacterService, MeModelState, ViewState } from '../../../services/character.service';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'game-dialogs',
  template: '',
  styleUrls: ['./game-dialogs.component.scss']
})
export class GameDialogsComponent implements OnInit {

  @Input()
  private gameResult: Observable<Team>;

  private gameoverDialogOpen = false;
  private wonDialogOpen = false;

  constructor(private dialog: MatDialog,
              private character: CharacterService) { }

  ngOnInit() {
    this.character.state$.subscribe(characterState=>{
      if (characterState && characterState.state === MeModelState.DEAD && !this.gameoverDialogOpen) {
        this.openGameOverDialog(false);
        if (this.character.initialized) {
          this.character.state = MeModelState.DEAD;
        }
      }
    });

    this.gameResult.subscribe(winingTeam=>{
      if (winingTeam !== 'NONE' && (!this.wonDialogOpen && !this.gameoverDialogOpen)) {
        const loseTeam: Team = winingTeam === 'RED' ? 'BLUE' : 'RED';
        if (winingTeam === this.character.currentStateValue.team) {
          this.openWinDialog(loseTeam);
        } else {
          this.openGameOverDialog(true, loseTeam);
        }
      }
    })
  }



  private openWinDialog(losingTeam: Team) {
    this.wonDialogOpen = true;
    this.dialog.open(YouWinDialogComponent, {
      height: '80%',
      width: '80%',
      disableClose: true,
      data: {losingTeam},
    });
  }

  private openGameOverDialog(gameOver: boolean, losingTeam?: Team) {
    this.gameoverDialogOpen = true;
    this.dialog.open(EndGameDialogComponent, {
      height: '80%',
      width: '80%',
      disableClose: true,
      data: {
        gameOver,
        losingTeam
      }
    }).afterClosed().subscribe((toOverView) => {
      if (toOverView) {
        this.character.viewState = ViewState.OVERVIEW;
      }
    });
  }

}
