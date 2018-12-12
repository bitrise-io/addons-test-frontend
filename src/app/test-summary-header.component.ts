import { Component, OnInit } from '@angular/core';
import { TestSuiteStatus } from './test-suite-status';
import { TestReport } from './test-report.model';
import { TestReportService } from './test-report.service';

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
    [status: string]: {
      statusName: string;
      cssClass: string;
      count: number;
    };
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

    const testSuiteCountsByStatuses: {
      [status: string]: number;
    } = testReports.reduce(
      (summedTestSuiteCountsByStatuses, testReport) => ({
        [TestSuiteStatus.inconclusive]:
          (summedTestSuiteCountsByStatuses[TestSuiteStatus.inconclusive] || 0) + testReport.inconclusiveTestSuiteCount,
        [TestSuiteStatus.passed]:
          (summedTestSuiteCountsByStatuses[TestSuiteStatus.passed] || 0) + testReport.passedTestSuiteCount,
        [TestSuiteStatus.failed]:
          (summedTestSuiteCountsByStatuses[TestSuiteStatus.failed] || 0) + testReport.failedTestSuiteCount,
        [TestSuiteStatus.skipped]:
          (summedTestSuiteCountsByStatuses[TestSuiteStatus.skipped] || 0) + testReport.skippedTestSuiteCount
      }),
      {}
    );

    Object.entries(testSuiteCountsByStatuses).forEach(([status, testSuiteCountWithStatus]) => {
      this.testSuitesByStatuses[status].count = testSuiteCountWithStatus;
      this.totalTestSuitesCount = (this.totalTestSuitesCount || 0) + testSuiteCountWithStatus;
    });
  }
}
