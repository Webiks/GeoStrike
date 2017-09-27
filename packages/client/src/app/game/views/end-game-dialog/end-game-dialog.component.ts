import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'end-game-dialog',
  templateUrl: './end-game-dialog.component.html',
  styleUrls: ['./end-game-dialog.component.scss']
})
export class EndGameDialogComponent implements OnInit {

  constructor(private modal: MdDialogRef<EndGameDialogComponent>) { }

  ngOnInit() {
    document.onclick = undefined;
    document.exitPointerLock();

  }

  reload(){
    location.href = '/'
  }

  overview(){
    const toOverviewMode = true;
    this.modal.close(toOverviewMode);
  }

}
