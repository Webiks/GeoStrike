import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'big-button',
  template: `
   <button class="btn-container" [class.highlight]="highlight" [style.width]="width ? width +'px': undefined">
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

  @Input()
  width: number;

  constructor() { }

  ngOnInit() {
  }

}
