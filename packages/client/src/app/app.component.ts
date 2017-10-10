import { Component , DoCheck } from '@angular/core';
import {ViewerConfiguration} from 'angular-cesium';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`,
  providers: [ViewerConfiguration]
})
export class AppComponent implements DoCheck{
  ngDoCheck (): void {
  }
  constructor(private iconRegistry: MatIconRegistry,private sanitizer: DomSanitizer) {

    this.addIcon('help');
    this.addIcon('left-mouse');
    this.addIcon('full-screen');
    this.addIcon('volume');
    this.addIcon('volume-off');
  }

  addIcon(iconName: string){
    this.iconRegistry.addSvgIcon(
      iconName,
      this.sanitizer.bypassSecurityTrustResourceUrl(`assets/icons/${iconName}.svg`));
  }
}
