import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideOdivonApi } from './core/api/api';
import { VersionStore } from './core/version/version-store';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // Must run before the router so a new release starts from a clean session on /login.
    provideAppInitializer(() => inject(VersionStore).resetIfNewRelease()),
    provideRouter(routes),
    provideOdivonApi(),
  ]
};
