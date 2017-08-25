import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AcNotification } from 'angular-cesium';

@Component({
  selector: 'game-map',
  templateUrl: './game-map.component.html',
  styleUrls: ['./game-map.component.scss']
})
export class GameMapComponent implements OnInit {
  @Input('players') private data$: Observable<AcNotification>;

  constructor() {
  }

  ngOnInit() {
    this.data$.subscribe(r => {
      console.log(r);
    });
  }

}
