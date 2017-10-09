import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'big-button',
  template: `
   <button class="btn-container" [class.highlight]="highlight">
       <span class="btn-text">{{text}}</span>
   </button>
  `,
  styleUrls: ['./big-button.component.scss']
})
export class BigButtonComponent implements OnInit {

  @Input()
  text: string;

  @Input()
  highlight = false;

  constructor() { }

  ngOnInit() {
  }

}
