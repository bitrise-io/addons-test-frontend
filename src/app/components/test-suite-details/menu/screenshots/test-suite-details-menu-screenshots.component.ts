import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable, combineLatest } from 'rxjs';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

import { TestReport } from 'src/app/models/test-report.model';
import { FetchReports } from 'src/app/store/reports/actions';
import { TestSuite, TestSuiteScreenshot } from 'src/app/models/test-suite.model';
import { TestReportState } from 'src/app/store/reports/reducer';

@Component({
  selector: 'bitrise-test-suite-details-menu-screenshots',
  templateUrl: './test-suite-details-menu-screenshots.component.html',
  styleUrls: ['./test-suite-details-menu-screenshots.component.scss']
})
export class TestSuiteDetailsMenuScreenshotsComponent implements OnInit, OnDestroy {
  screenshots: TestSuiteScreenshot[];
  testReports$: Observable<TestReport[]>;
  subscription: Subscription;
  downloadAllScreenshotsURL: string;
  orientation: 'landscape' | 'portrait';

  get gridCssClass() {
    let cssClass = 'screenshots__grid';

    if (this.orientation) {
      cssClass += ` ${cssClass}--${this.orientation}`;
    }

    return cssClass;
  }

  constructor(private store: Store<{ testReport: TestReportState }>, private activatedRoute: ActivatedRoute) {
    this.testReports$ = store.select('testReport', 'testReports');
  }

  ngOnInit() {
    this.store.dispatch(new FetchReports());

    const routeParams = combineLatest(this.activatedRoute.pathFromRoot.map((t) => t.params)).pipe(
      map((paramObjects) => Object.assign({}, ...paramObjects))
    );

    this.subscription = combineLatest(routeParams, this.testReports$)
      .pipe(
        map(([params, testReports]) => {
          const testReportId = Number(params.testReportId);
          const testSuiteId = Number(params.testSuiteId);

          const testReport: TestReport = testReports.find(({ id }: TestReport) => id === testReportId);
          if (testReport) {
            const testSuite = testReport.testSuites.find(({ id }: TestSuite) => id === testSuiteId);
            if (testSuite) {
              this.screenshots = testSuite.screenshots;
              this.downloadAllScreenshotsURL = testSuite.downloadAllScreenshotsURL;
              this.orientation = testSuite.orientation;
            }
          }
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
