import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'medium-button',
  styleUrls: ['./medium-button.component.scss'],
  template :`
    <button class="btn-container">
      <span class="btn-text">{{text}}</span>
    </button>
  `,

})
export class MediumButtonComponent implements OnInit {

  @Input()
  text: string;

  @Input()
  highlight = false;

  @Input()
  width: number;

  @Input()
  fontSize: number;

  constructor() { }

  ngOnInit() {
  }

}
