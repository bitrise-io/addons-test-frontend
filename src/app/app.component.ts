import { Component, OnInit, Inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Beam } from '@bitrise/beam';
import { filter } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { WINDOW } from 'ngx-window-token';

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

  constructor(
    @Inject(WINDOW) private window: Window,
    private router: Router,
    private store: Store<{ testReport: AppStoreState }>
  ) {
    this.appResult$ = store.select('app');
  }

  ngOnInit() {
    const { segmentWriteKey } = environment;
    this.appResult$.subscribe(({ slug, name }: AppResult) => {
      if (!slug || !name) {
        return;
      }

      Beam.init({
        app_slug: slug,
        app_name: name
      });

      if (segmentWriteKey && !(this.window.analytics && this.window.analytics.initialize)) {
        initializeSegment(segmentWriteKey);

        this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
          this.window.analytics.page({ addonId: 'addons-testing', appSlug: slug, appName: name });
        });
      }
    });

    this.store.dispatch(new FetchApp());
  }
}
