import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { TestReport } from '../models/test-report.model';
import { TestReportState } from '../store/reports/reducer';
import { FetchReports } from '../store/reports/actions';
import { TestSuite } from '../models/test-suite.model';

@Injectable()
export class TestSuiteResolve implements Resolve {
  testReports$: Observable<TestReport[]>;

  constructor(
    private router: Router,
    private store: Store<{
      testReport: TestReportState;
    }>
  ) {
    this.testReports$ = store.select('testReport', 'testReports');
  }

  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<{
    selectedTestReport: TestReport;
    selectedTestSuite: TestSuite;
  }> {
    this.store.dispatch(new FetchReports());

    let testReportId = route.params.testReportId;
    let testSuiteId = route.params.testSuiteId;

    return this.testReports$.pipe(
      first(),
      map((testReports: TestReport[]) => {
        const testSuiteData = {
          selectedTestReport: null,
          selectedTestSuite: null
        };

        testSuiteData.selectedTestReport = testReports.find(
          (testReport: TestReport) => testReport.id === Number(testReportId)
        );

        if (testSuiteData.selectedTestReport) {
          testSuiteData.selectedTestSuite = testSuiteData.selectedTestReport.testSuites.find(
            (testSuite: TestSuite) => testSuite.id === Number(testSuiteId)
          );
        }

        return testSuiteData;
      })
    );
  }
}
