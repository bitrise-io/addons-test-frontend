import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { TestReport } from '../../models/test-report.model';
import { TestSuite, TestSuiteStatus } from '../../models/test-suite.model';
import { TestReportState } from 'src/app/store/reports/reducer';
import { StartPollingReports, FilterReports } from 'src/app/store/reports/actions';

@Component({
  selector: 'bitrise-test-summary-header',
  templateUrl: './test-summary-header.component.html',
  styleUrls: ['./test-summary-header.component.scss']
})
export class TestSummaryHeaderComponent implements OnInit {
  TestSuite = TestSuite;
  TestSuiteStatus = TestSuiteStatus;
  testReports$: Observable<TestReport[]>;
  testFilter$: Observable<TestSuiteStatus>;
  visibleTestSuiteStatuses = [
    TestSuiteStatus.failed,
    TestSuiteStatus.passed,
    TestSuiteStatus.skipped,
    TestSuiteStatus.inconclusive
  ];
  testCountsByStatuses: {
    [status: number]: number;
  };
  totalTestCount: number;

  selectedStatus: TestSuiteStatus;

  constructor(private activatedRoute: ActivatedRoute, private store: Store<{ testReport: TestReportState }>) {
    this.testReports$ = store.select('testReport', 'testReports');
    this.testFilter$ = store.select('testReport', 'filter');
  }

  isStatusFilteredOut(status: TestSuiteStatus) {
    if (this.selectedStatus || this.selectedStatus === 0) {
      return status !== this.selectedStatus;
    } else {
      return false;
    }
  }

  onStatusSelectorChange(status: TestSuiteStatus) {
    this.store.dispatch(new FilterReports({ filter: status }));
  }

  ngOnInit() {
    this.store.dispatch(new FilterReports({ filter: null }));
    this.activatedRoute.params.subscribe((params: Params) => {
      this.store.dispatch(new StartPollingReports({ buildSlug: params.buildSlug }));
    });

    this.testFilter$.subscribe((filter) => {
      this.selectedStatus = filter;
    });
    this.testReports$.subscribe((testReports) => {
      const allTestSuiteStatuses = [
        TestSuiteStatus.failed,
        TestSuiteStatus.passed,
        TestSuiteStatus.skipped,
        TestSuiteStatus.inconclusive,
        TestSuiteStatus.inProgress
      ];

      this.testCountsByStatuses = allTestSuiteStatuses.reduce(
        (sumByStatus, status: TestSuiteStatus) => ({
          ...sumByStatus,
          [status]: testReports.reduce(
            (sum, testReport: TestReport) => sum + testReport.testSuitesWithStatus(status).length,
            0
          )
        }),
        {}
      );

      this.totalTestCount = allTestSuiteStatuses.reduce(
        (totalSum, status: TestSuiteStatus) => totalSum + this.testCountsByStatuses[status],
        0
      );
    });
  }
}
