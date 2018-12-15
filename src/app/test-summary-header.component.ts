import { Component, OnInit } from '@angular/core';
import { TestReportService } from './test-report.service';
import { TestReport } from './test-report.model';
import { TestSuite, TestSuiteStatus } from './test-suite.model';

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

    this.testSuiteCountsByStatuses = this.orderedTestSuiteStatuses.reduce(
      (sumByStatus, status: TestSuiteStatus) => ({
        ...sumByStatus,
        [status]: testReports.reduce(
          (sum, testReport: TestReport) => sum + testReport.testSuitesWithStatus(status).length,
          0
        )
      }),
      {}
    );

    this.totalTestSuitesCount = this.orderedTestSuiteStatuses.reduce(
      (sumByStatus, status: TestSuiteStatus) => sumByStatus + this.testSuiteCountsByStatuses[status],
      0
    );
  }
}
