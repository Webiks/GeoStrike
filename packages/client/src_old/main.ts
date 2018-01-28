import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

(navigator as any).pointerEnabled = false;

if (environment.production) {
  enableProdMode();
}

window['CESIUM_BASE_URL'] = '/assets/cesium';
platformBrowserDynamic().bootstrapModule(AppModule);
