import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'end-game-dialog',
  templateUrl: './end-game-dialog.component.html',
  styleUrls: ['./end-game-dialog.component.scss']
})
export class EndGameDialogComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  reload(){
    location.href = '/'
  }

}
