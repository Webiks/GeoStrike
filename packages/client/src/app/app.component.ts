import {Component} from '@angular/core';
import {ViewerConfiguration} from 'angular-cesium';

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`,
  providers: [ViewerConfiguration]
})
export class AppComponent {
  constructor() {
  }
}
