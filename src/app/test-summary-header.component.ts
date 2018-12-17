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
  testCountsByStatuses: {
    [status: number]: number;
  };
  totalTestCount: number;

  constructor(private testReportService: TestReportService) {}

  ngOnInit() {
    const testReports = this.testReportService.getTestReports();

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
  }
}
