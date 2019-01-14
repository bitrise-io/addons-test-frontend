import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';

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
  testReportsSubscription: Subscription;
  activatedRouteParamsChangeSubscription: Subscription;

  constructor(
    private store: Store<{
      testReport: TestReport[];
    }>,
    private activatedRoute: ActivatedRoute;
  ) {
    this.testReports$ = store.pipe(select('testReport'));
  }

  ngOnInit() {
    this.store.dispatch(new TestReportStoreActionLoad());

    this.testReportsSubscription = this.testReports$.subscribe((testReports: TestReport[]) => {
      this.testReports = testReports;
    });

    this.activatedRouteParamsChangeSubscription = this.activatedRoute.params.subscribe((params: Params) => {
      this.testReport = this.testReports.find((testReport: TestReport) => testReport.id === Number(params['testReportId']));
    });
  }

  ngOnDestroy() {
    this.testReportsSubscription.unsubscribe();
    this.activatedRouteParamsChangeSubscription.unsubscribe();
  }
}
