import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material';
import { KeyboardKeysService } from '../../../core/services/keyboard-keys.service';

@Component({
  selector: 'how-to-play-dialog',
  templateUrl: './how-to-play-dialog.component.html',
  styleUrls: ['./how-to-play-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HowToPlayDialogComponent implements OnInit {

  keys: {keyName: string,description: string}[];
  constructor(public dialog: MatDialog,private keyboardKeysService: KeyboardKeysService) { }

  ngOnInit() {
    this.keys = Array.from(this.keyboardKeysService.getRegisteredKey()
      .entries())
      .filter(([keyName,keyInput])=> keyInput.description)
      .map(([keyName,keyInput])=>{
        const name = keyName.replace(/^Key/,'');
        return {keyName: name, description: keyInput.description};
    });
  }

}
