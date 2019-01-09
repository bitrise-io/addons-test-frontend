import { Component, OnInit, Inject } from '@angular/core';
import { Beam } from '@bitrise/beam';

import { BackendService, BACKEND_SERVICE } from './services/backend/backend.model';
import { Character } from './services/backend/backend.model';

@Component({
  selector: 'bitrise-app-root',
  template: `
    <bitrise-app-header></bitrise-app-header>
    <router-outlet></router-outlet>
    <bitrise-app-footer></bitrise-app-footer>
  `,
  styles: []
})
export class AppComponent implements OnInit {
  constructor(@Inject(BACKEND_SERVICE) private backendService: BackendService) {
    this.backendService.getCharacter(1).subscribe((character: Character) => {
      console.log('got character', character);
    });
  }

  ngOnInit() {
    Beam.init({
      app_slug: 'd08709ae5c5f6171',
      app_name: 'Fast building app'
    });
  }
}
