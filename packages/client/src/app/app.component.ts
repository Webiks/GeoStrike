import { Component , DoCheck } from '@angular/core';
import {ViewerConfiguration} from 'angular-cesium';

declare var Zone;
@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`,
  providers: [ViewerConfiguration]
})
export class AppComponent implements DoCheck{
  ngDoCheck (): void {

    console.log('do check',Zone.current);
  }
  constructor() {
  }
}
