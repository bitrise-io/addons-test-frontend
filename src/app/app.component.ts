import { Component, OnInit, Inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Beam } from '@bitrise/beam';
import { filter } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { environment } from 'src/environments/environment';
import { initializeSegment } from 'src/app/services/segment';
import { Observable } from 'rxjs';
import { AppStoreState } from './store/app/reducer';
import { AppResult } from './services/backend/backend.model';
import { FetchApp } from './store/app/actions';

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
  appResult$: Observable<AppResult>;

  constructor(private router: Router, private store: Store<{ testReport: AppStoreState }>) {
    this.appResult$ = store.select('app');
  }

  ngOnInit() {
    this.appResult$.subscribe((appResult: AppResult) => {
      if (!appResult.slug || !appResult.name) {
        return;
      }

      Beam.init({
        app_slug: appResult.slug,
        app_name: appResult.name
      });
    });

    this.store.dispatch(new FetchApp());

    const { segmentWriteKey } = environment;

    if (segmentWriteKey) {
      initializeSegment(segmentWriteKey);

      this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
        window.analytics.page({ addonId: 'addons-testing' });
      });
    }
  }
}
