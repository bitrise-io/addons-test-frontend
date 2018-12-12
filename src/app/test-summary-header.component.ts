import { Component, OnInit } from '@angular/core';
import { TestSuiteStatus } from './test-suite-status';
import { TestReportService } from './test-report.service';

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

    const testSuiteCountsByStatuses: {
      [status: string]: number;
    } = testReports.reduce(
      (summedTestSuiteCountsByStatuses, testReport) => ({
        [TestSuiteStatus.inconclusive]:
          (summedTestSuiteCountsByStatuses[TestSuiteStatus.inconclusive] || 0) +
          testReport.testSuites.filter(testSuite => testSuite.status === TestSuiteStatus.inconclusive).length,
        [TestSuiteStatus.passed]:
          (summedTestSuiteCountsByStatuses[TestSuiteStatus.passed] || 0) +
          testReport.testSuites.filter(testSuite => testSuite.status === TestSuiteStatus.passed).length,
        [TestSuiteStatus.failed]:
          (summedTestSuiteCountsByStatuses[TestSuiteStatus.failed] || 0) +
          testReport.testSuites.filter(testSuite => testSuite.status === TestSuiteStatus.failed).length,
        [TestSuiteStatus.skipped]:
          (summedTestSuiteCountsByStatuses[TestSuiteStatus.skipped] || 0) +
          testReport.testSuites.filter(testSuite => testSuite.status === TestSuiteStatus.skipped).length
      }),
      {}
    );

    Object.entries(testSuiteCountsByStatuses).forEach(([status, testSuiteCountWithStatus]) => {
      this.testSuitesByStatuses[status].count = testSuiteCountWithStatus;
      this.totalTestSuitesCount = (this.totalTestSuitesCount || 0) + testSuiteCountWithStatus;
    });
  }
}
