import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { YouWinDialogComponent } from '../../you-win-dialog/you-win-dialog.component';
import { Team } from '../../../../types';
import { EndGameDialogComponent } from '../../end-game-dialog/end-game-dialog.component';
import { CharacterService, MeModelState, ViewState } from '../../../services/character.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { BenchedDialogComponent } from '../../benched-dialog/benched-dialog.component';

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
  private benchedDialogOpen = false;
  private benchedDialog: MatDialogRef<BenchedDialogComponent>;


  constructor(private dialog: MatDialog,
              private character: CharacterService,
              private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.character.state$.subscribe(characterState=>{
      if (characterState && characterState.state === MeModelState.DEAD && !this.gameoverDialogOpen) {
        this.openGameOverDialog(false);
        if (this.character.initialized) {
          this.character.state = MeModelState.DEAD;
        }
      } else  if (characterState && characterState.state === MeModelState.CONTROLLED && !this.benchedDialogOpen){
        this.openBenchedDialog(characterState.characterInfo.name);
      } else if (characterState && this.benchedDialogOpen && characterState.state !== MeModelState.CONTROLLED){
        this.benchedDialog.close();
        this.benchedDialogOpen = false;
      }

      this.cd.detectChanges();
    });

    this.gameResult.subscribe(winingTeam=>{
      if (winingTeam !== 'NONE' && (!this.wonDialogOpen && !this.gameoverDialogOpen)) {
        const loseTeam: Team = winingTeam === 'RED' ? 'BLUE' : 'RED';

        const isViewer = this.character.meFromServer['__typename'] === 'Viewer';
        if (isViewer || winingTeam === this.character.currentStateValue.team) {
          this.openWinDialog(loseTeam);
        } else {
          this.openGameOverDialog(true, loseTeam);
        }
        this.cd.detectChanges();
      }
    })
  }


  private openBenchedDialog(playerName){
    this.benchedDialogOpen = true;
    this.benchedDialog = this.dialog.open(BenchedDialogComponent,{
      height: '80%',
      width: '80%',
      disableClose: true,
      data: {playerName},
    });
    this.benchedDialog.afterClosed().subscribe((toOverView) => {
      if (toOverView) {
        this.benchedDialogOpen = false;
        this.character.viewState = ViewState.OVERVIEW;
      }
    });
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
        this.gameoverDialogOpen = false;
        this.character.viewState = ViewState.OVERVIEW;
      }
    });
  }

}
