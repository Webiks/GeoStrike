import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'arrow-keys',
  template: `
    <div class="arrows-row">
      <key-button *ngFor="let keyName of keys" [keyInfo]="{keyName: keyName}" class="key"></key-button>
    </div>
  `,
  styleUrls: ['./arrow-keys.component.scss']
})
export class ArrowKeysComponent implements OnInit {

  keys = ['arrow-up', 'arrow-down', 'arrow-left', 'arrow-right'];

  constructor() {
  }

  ngOnInit() {
  }

}
