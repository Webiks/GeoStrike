import { Component, DoCheck } from '@angular/core';
import { ViewerConfiguration } from 'angular-cesium';
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
    this.addIcon('setting');
    this.addIcon('fullscreen-exit');
    this.addIcon('look-around-mouse');
    this.addIcon('arrow-left');
    this.addIcon('arrow-right');
    this.addIcon('arrow-up');
    this.addIcon('arrow-down');
    console.log("new version")
  }

  addIcon(iconName: string){
    this.iconRegistry.addSvgIcon(
      iconName,
      this.sanitizer.bypassSecurityTrustResourceUrl(`assets/icons/${iconName}.svg`));
  }
}
