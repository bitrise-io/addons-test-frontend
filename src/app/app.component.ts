import { Component, OnInit } from '@angular/core';
import { Beam } from '@bitrise/beam';

@Component({
  selector: 'app-root',
  template: `
    <app-header></app-header>
    <app-footer></app-footer>
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
