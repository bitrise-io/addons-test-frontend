import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { TestReport } from '../models/test-report.model';
import { StartPollingReports } from '../store/reports/actions';
import { TestSuite } from '../models/test-suite.model';

@Injectable()
export class TestSuiteResolve
  implements
    Resolve<
      Observable<{
        buildSlug: string;
        selectedTestReport: TestReport;
        selectedTestSuite: TestSuite;
      }>
    > {
  testReports$: Observable<TestReport[]>;

  constructor(
    private store: Store<any>
  ) {
    this.testReports$ = store.select('testReport', 'testReports');
  }

  resolve(route: ActivatedRouteSnapshot) {
    const {
      params: {
        buildSlug,
        testReportId,
        testSuiteId
      }
    } = route;

    this.store.dispatch(new StartPollingReports({ buildSlug }));

    return this.testReports$.pipe(
      first((testReports: TestReport[]) => {
        if (!testReportId) {
          return true;
        }

        const selectedTestReport = testReports.find(
          (testReport: TestReport) => testReport.id === testReportId
        );

        if (!testSuiteId) {
          return selectedTestReport !== undefined;
        }

        return selectedTestReport && selectedTestReport.testSuites.some(
          (testSuite: TestSuite) => testSuite.id === Number(testSuiteId)
        );
      }),
      map((testReports: TestReport[]) => {
        const testSuiteData = {
          buildSlug,
          selectedTestReport: null,
          selectedTestSuite: null
        };

        testSuiteData.selectedTestReport = testReports.find(
          (testReport: TestReport) => testReport.id === testReportId
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
