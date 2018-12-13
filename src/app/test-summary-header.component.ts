import { Component, OnInit } from '@angular/core';
import { TestReportService } from './test-report.service';
import { TestReport } from './test-report.model';
import { TestSuite, TestSuiteStatus } from './test-suite.model';

interface TestSuiteStatusInformation {
  statusName: string;
  cssClass: string;
  count: number;
}

@Component({
  selector: 'bitrise-test-summary-header',
  templateUrl: './test-summary-header.component.html',
  styleUrls: ['./test-summary-header.component.scss']
})
export class TestSummaryHeaderComponent implements OnInit {
  public testSuiteStatusEnum = TestSuiteStatus;
  orderedTestSuiteStatuses = [
    TestSuiteStatus.failed,
    TestSuiteStatus.passed,
    TestSuiteStatus.skipped,
    TestSuiteStatus.inconclusive
  ];
  testSuitesByStatuses: {
    [status: string]: TestSuiteStatusInformation;
  } = {
    [TestSuiteStatus.inconclusive]: {
      statusName: 'inconclusive',
      cssClass: 'inconclusive',
      count: undefined
    },
    [TestSuiteStatus.passed]: {
      statusName: 'passed',
      cssClass: 'passed',
      count: undefined
    },
    [TestSuiteStatus.failed]: {
      statusName: 'failed',
      cssClass: 'failed',
      count: undefined
    },
    [TestSuiteStatus.skipped]: {
      statusName: 'skipped',
      cssClass: 'skipped',
      count: undefined
    }
  };
  totalTestSuitesCount: number;

  constructor(private testReportService: TestReportService) {}

  ngOnInit() {
    const testReports = this.testReportService.getTestReports();

    this.orderedTestSuiteStatuses.forEach((status: number) => {
      this.testSuitesByStatuses[status].count = testReports.reduce(
        (testSuiteCountWithStatus: number, testReport: TestReport) =>
          testSuiteCountWithStatus + testReport.testSuitesWithStatus(status).length,
        0
      );

      this.totalTestSuitesCount = (this.totalTestSuitesCount || 0) + this.testSuitesByStatuses[status].count;
    });
  }
}
