import { Component, OnInit } from '@angular/core';
import { TestReportService } from './test-report.service';
import { TestReport } from './test-report.model';
import { TestSuite, TestSuiteStatus } from './test-suite.model';

interface TestSuiteStatusInformation {
  count: number;
}

@Component({
  selector: 'bitrise-test-summary-header',
  templateUrl: './test-summary-header.component.html',
  styleUrls: ['./test-summary-header.component.scss']
})
export class TestSummaryHeaderComponent implements OnInit {
  TestSuite = TestSuite;
  TestSuiteStatus = TestSuiteStatus;
  orderedTestSuiteStatuses = [
    TestSuiteStatus.failed,
    TestSuiteStatus.passed,
    TestSuiteStatus.skipped,
    TestSuiteStatus.inconclusive
  ];
  testSuiteCountsByStatuses: {
    [status: number]: number;
  };
  totalTestSuitesCount: number;

  constructor(private testReportService: TestReportService) {}

  ngOnInit() {
    const testReports = this.testReportService.getTestReports();

    this.orderedTestSuiteStatuses.forEach((status: TestSuiteStatus) => {
      this.testSuiteCountsByStatuses = Object.assign(this.testSuiteCountsByStatuses || {}, {
        [status]: testReports.reduce(
          (testSuiteCountWithStatus: number, testReport: TestReport) =>
            (testSuiteCountWithStatus += testReport.testSuitesWithStatus(status).length),
          0
        )
      });

      this.totalTestSuitesCount = (this.totalTestSuitesCount || 0) + this.testSuiteCountsByStatuses[status];
    });
  }
}
