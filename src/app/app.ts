import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UpdateDialog } from './core/version/update-dialog';
import { VersionStore } from './core/version/version-store';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, UpdateDialog],
  template: `
    <router-outlet />
    @if (version.updateRequired()) {
      <app-update-dialog />
    }
  `,
})
export class App {
  readonly version = inject(VersionStore);
  constructor() {
    this.version.start();
  }
}
