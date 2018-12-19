import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { TestReport } from './test-report.model';
import { TestSuite, TestSuiteStatus } from './test-suite.model';
import { TestReportActionLoad } from './test-report.actions';

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
    this.testReports$ = store.pipe(select('testReport'));
  }

  ngOnInit() {
    this.store.dispatch(new TestReportActionLoad());

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
