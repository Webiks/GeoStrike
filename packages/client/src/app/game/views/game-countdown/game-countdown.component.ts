import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'game-countdown',
  templateUrl: './game-countdown.component.html',
  styleUrls: ['./game-countdown.component.scss']
})
export class GameCountdownComponent implements OnInit {
  @Input() count = 3;
  @Output() done: EventEmitter<any> = new EventEmitter<any>();
  currentCount = 0;
  showCountdown = true;

  constructor() {
  }

  ngOnInit() {
    this.currentCount = this.count;

    const intervalHandler = setInterval(() => {
      this.currentCount--;

      if (this.currentCount === 0) {
        this.showCountdown = false;
        this.done.emit();
        clearInterval(intervalHandler);
      }
    }, 1000);
  }

}
