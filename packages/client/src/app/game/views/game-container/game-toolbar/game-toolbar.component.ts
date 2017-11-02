import { Component, Input, OnInit } from '@angular/core';
import { HowToPlayDialogComponent } from '../../how-to-play-dialog/how-to-play-dialog.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'game-toolbar',
  template: `
    <div class="right-btn-panel">
      <button mat-icon-button class="help-btn" (click)="toggleMute()">
        <mat-icon [svgIcon]="mute ? 'volume-off' : 'volume'"></mat-icon>
      </button>
      <button mat-icon-button class="help-btn" (click)="toggleFullScreen()">
        <mat-icon [svgIcon]="fullScreenIcon"></mat-icon>
      </button>
      <button mat-icon-button class="help-btn" (click)="openHelp()">
        <mat-icon svgIcon="help"></mat-icon>
      </button>
      <button mat-icon-button class="help-btn" (click)="showMenu= !showMenu">
        <mat-icon svgIcon="setting"></mat-icon>
      </button>
    </div>
    <div class="settings-panel" *ngIf="showMenu">
      <div class="settings-item">GAME CODE: {{gameCode}}</div>
      <div class="settings-item" (click)="exitGame()">EXIT THE GAME</div>
    </div>
  `,
  styleUrls: ['./game-toolbar.component.scss']
})
export class GameToolbarComponent implements OnInit {

  @Input()
  gameCode: string;

  showMenu = false;
  mute = false;
  fullScreenIcon = 'full-screen';

  constructor(private  dialog: MatDialog) {
  }

  ngOnInit() {
  }

  openHelp() {
    this.dialog.open(HowToPlayDialogComponent, {
      height: '80%',
      width: '85%',
      panelClass: 'container-how-to-play'
    })
  }

  toggleFullScreen() {
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      if ('requestFullScreen' in document.body) {
        document.body.requestFullscreen();
      } else if ('webkitRequestFullscreen' in document.body) {
        document.body.webkitRequestFullscreen();
      }
      this.fullScreenIcon = 'fullscreen-exit';

    } else {
      if ('exitFullscreen' in document) {
        document.exitFullscreen();
      } else if ('webkitExitFullscreen' in document) {
        document.webkitExitFullscreen();
      }
      this.fullScreenIcon = 'full-screen';
    }
  }

  toggleMute() {
    const audios = document.getElementsByTagName('audio');
    for (let i = 0; i < audios.length; i++) {
      const audio = audios[i];
      audio.muted = !audio.muted;
    }

    this.mute = !this.mute;
  }

  exitGame() {
    location.href = '/';
  }

}
