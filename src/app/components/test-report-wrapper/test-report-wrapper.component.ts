import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { TestReport } from '../../models/test-report.model';
import { TestReportStoreActionLoad } from '../test-report/test-report.store';

@Component({
  selector: 'bitrise-test-report-wrapper',
  templateUrl: './test-report-wrapper.component.html',
  styleUrls: ['./test-report-wrapper.component.scss']
})
export class TestReportWrapperComponent implements OnInit, OnDestroy {
  testReports: TestReport[];
  testReports$: Observable<TestReport[]>;
  testReport: TestReport;
  combinedSubscription: Subscription;

  constructor(
    private store: Store<{
      testReport: TestReport[];
    }>,
    private activatedRoute: ActivatedRoute
  ) {
    this.testReports$ = store.select('testReport');
  }

  ngOnInit() {
    this.store.dispatch(new TestReportStoreActionLoad());

    this.combinedSubscription = combineLatest(this.activatedRoute.params, this.testReports$)
      .pipe(
        map(results => {
          const params = results[0];
          const testReports = results[1];
          this.testReport = testReports.find(
            (testReport: TestReport) => testReport.id === Number(params['testReportId'])
          );
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.combinedSubscription.unsubscribe();
  }
}
