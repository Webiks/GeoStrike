import { Component , DoCheck } from '@angular/core';
import {ViewerConfiguration} from 'angular-cesium';
import { MdIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`,
  providers: [ViewerConfiguration]
})
export class AppComponent implements DoCheck{
  ngDoCheck (): void {
  }
  constructor(iconRegistry: MdIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'help',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/help.svg'));
    iconRegistry.addSvgIcon(
      'left-mouse',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/left-mouse.svg'));
  }
}
