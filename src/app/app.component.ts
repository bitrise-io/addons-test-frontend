import { Component, OnInit, Inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Beam } from '@bitrise/beam';
import { filter } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { initializeSegment } from 'src/app/services/segment';

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
  constructor(private router: Router) {}

  ngOnInit() {
    Beam.init({
      app_slug: 'd08709ae5c5f6171',
      app_name: 'Fast building app'
    });

    const { segmentWriteKey } = environment;

    if (segmentWriteKey) {
      initializeSegment(segmentWriteKey);

      this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
        window.analytics.page();
      });
    }
  }
}
