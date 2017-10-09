import { Component, OnInit } from '@angular/core';
import { HowToPlayDialogComponent } from '../../how-to-play-dialog/how-to-play-dialog.component';
import { MapsManagerService } from 'angular-cesium';
import { MdDialog } from '@angular/material';

@Component({
  selector: 'game-toolbar',
  template: `
    <div class="right-btn-panel">
      <button md-icon-button class="help-btn" (click)="toggleMute($event)">
        <md-icon [svgIcon]="mute ? 'volume-off' : 'volume'"></md-icon>
      </button>
      <button md-icon-button class="help-btn" (click)="fullScreen($event)">
        <md-icon svgIcon="full-screen"></md-icon>
      </button>
      <button md-icon-button class="help-btn" (click)="openHelp($event)">
        <md-icon svgIcon="help"></md-icon>
      </button>
    </div>
  `,
  styleUrls: ['./game-toolbar.component.scss']
})
export class GameToolbarComponent implements OnInit {

  private mute = false;

  constructor(private  dialog: MdDialog,
              private mapsManager: MapsManagerService) { }

  ngOnInit() {
  }

  openHelp(event: Event) {
    this.dialog.open(HowToPlayDialogComponent, {
      height: '80%',
      width: '85%',
      panelClass: 'container-how-to-play'
    })
  }

  fullScreen(){
    const viewer = this.mapsManager.getMap().getCesiumViewer();
    const canvas = viewer.canvas;
    if ('requestFullScreen' in canvas) {
      canvas.requestFullscreen();
    }else if ('webkitRequestFullscreen' in canvas){
      canvas.webkitRequestFullscreen();
    } else if ('mozRequestFullScreen' in canvas){
      canvas.mozRequestFullScreen();
    }
  }

  toggleMute(){
    const audios = document.getElementsByTagName('audio');
    for (let i =0 ; i < audios.length; i++){
      const audio = audios[i];
      audio.muted = !audio.muted;
    }

    this.mute = !this.mute;
  }

}
