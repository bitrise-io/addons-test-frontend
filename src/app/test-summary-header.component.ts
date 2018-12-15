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

    this.orderedTestSuiteStatuses.forEach((status: TestSuiteStatus) => {
      this.testCountsByStatuses = Object.assign(this.testCountsByStatuses || {}, {
        [status]: testReports.reduce(
          (testSuiteCountWithStatus: number, testReport: TestReport) =>
            (testSuiteCountWithStatus += testReport.testsWithStatus(status).length),
          0
        )
      });

      this.totalTestCount = (this.totalTestCount || 0) + this.testCountsByStatuses[status];
    });
  }
}
