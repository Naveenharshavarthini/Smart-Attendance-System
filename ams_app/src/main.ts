/// <reference types="@angular/localize" />

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import '@angular/compiler'; // Ensure compiler is imported

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
