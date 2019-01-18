import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { TestReport } from '../../models/test-report.model';
import { TestSuite, TestSuiteStatus } from '../../models/test-suite.model';
import { TestReportStoreActionLoad } from '../test-report/test-report.store';

@Component({
  selector: 'bitrise-test-summary-header',
  templateUrl: './test-summary-header.component.html',
  styleUrls: ['./test-summary-header.component.scss']
})
export class TestSummaryHeaderComponent implements OnInit {
  TestSuite = TestSuite;
  TestSuiteStatus = TestSuiteStatus;
  testReports$: Observable<TestReport[]>;
  orderedTestSuiteStatuses = [
    TestSuiteStatus.failed,
    TestSuiteStatus.passed,
    TestSuiteStatus.skipped,
    TestSuiteStatus.inconclusive
  ];
  testCountsByStatuses: {
    [status: number]: number;
  };
  totalTestCount: number;

  constructor(
    private store: Store<{
      testReport: TestReport[];
    }>
  ) {
    this.testReports$ = store.select('testReport');
  }

  ngOnInit() {
    this.store.dispatch(new TestReportStoreActionLoad());

    this.testReports$.subscribe((testReports: TestReport[]) => {
      this.testCountsByStatuses = this.orderedTestSuiteStatuses.reduce(
        (sumByStatus, status: TestSuiteStatus) => ({
          ...sumByStatus,
          [status]: testReports.reduce(
            (sum, testReport: TestReport) => sum + testReport.testsWithStatus(status).length,
            0
          )
        }),
        {}
      );

      this.totalTestCount = this.orderedTestSuiteStatuses.reduce(
        (sumByStatus, status: TestSuiteStatus) => sumByStatus + this.testCountsByStatuses[status],
        0
      );
    });
  }
}
