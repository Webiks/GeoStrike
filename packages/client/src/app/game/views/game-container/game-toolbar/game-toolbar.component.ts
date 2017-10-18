import { Component, OnInit } from '@angular/core';
import { HowToPlayDialogComponent } from '../../how-to-play-dialog/how-to-play-dialog.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'game-toolbar',
  template: `
    <div class="right-btn-panel">
      <button mat-icon-button class="help-btn" (click)="toggleMute()">
        <mat-icon [svgIcon]="mute ? 'volume-off' : 'volume'"></mat-icon>
      </button>
      <button mat-icon-button class="help-btn" (click)="fullScreen()">
        <mat-icon svgIcon="full-screen"></mat-icon>
      </button>
      <button mat-icon-button class="help-btn" (click)="openHelp($event)">
        <mat-icon svgIcon="help" ></mat-icon>
      </button>
    </div>
  `,
  styleUrls: ['./game-toolbar.component.scss']
})
export class GameToolbarComponent implements OnInit {

  mute = false;

  constructor(private  dialog: MatDialog) {
  }

  ngOnInit() {
  }

  openHelp(event: Event) {
    this.dialog.open(HowToPlayDialogComponent, {
      height: '80%',
      width: '85%',
      panelClass: 'container-how-to-play'
    })
  }

  fullScreen() {
    if ('requestFullScreen' in document.body) {
      document.body.requestFullscreen();
    } else if ('webkitRequestFullscreen' in document.body) {
      document.body.webkitRequestFullscreen();
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

}
