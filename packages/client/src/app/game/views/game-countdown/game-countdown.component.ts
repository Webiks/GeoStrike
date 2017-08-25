import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'game-countdown',
  templateUrl: './game-countdown.component.html',
  styleUrls: ['./game-countdown.component.scss']
})
export class GameCountdownComponent implements OnInit {
  @Input() private count = 3;
  @Output() private done: EventEmitter<any> = new EventEmitter<any>();
  private currentCount = 0;

  constructor() {
  }

  ngOnInit() {
    this.currentCount = this.count;

    const intervalHandler = setInterval(() => {
      this.currentCount--;

      if (this.currentCount === 0) {
        this.done.emit();
        clearInterval(intervalHandler);
      }
    }, 1000);
  }

}
