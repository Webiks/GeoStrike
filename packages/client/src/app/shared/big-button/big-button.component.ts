import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'big-button',
  template: `
   <button (click)="click.emit()" class="btn-container">
       <span class="btn-text">{{text}}</span>
   </button>
  `,
  styleUrls: ['./big-button.component.scss']
})
export class BigButtonComponent implements OnInit {

  @Input()
  text: string;

  @Output()
  click = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

}
