import { Component, OnInit } from '@angular/core';
import { Beam } from '@bitrise/beam';

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
  ngOnInit() {
    Beam.init({
      app_slug: 'd08709ae5c5f6171',
      app_name: 'Fast building app'
    });
  }
}
