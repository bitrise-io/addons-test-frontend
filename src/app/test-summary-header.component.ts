import { Component, OnInit } from '@angular/core';
import { TestSuiteStatus } from './test-suite-status';
import { TestReport } from './test-report.model';
import { TestReportService } from './test-report.service';

@Component({
  selector: 'bitrise-test-summary-header',
  templateUrl: './test-summary-header.component.html'
})
export class TestSummaryHeaderComponent implements OnInit {
  public testSuiteStatus = TestSuiteStatus;
  testReports: TestReport[];
  testSuiteCountsByStatuses: {
    status: number;
    name: string;
    cssClass: string;
    testSuiteCount: number;
  }[] = [
    {
      status: TestSuiteStatus.failed,
      name: 'failed',
      cssClass: 'failed',
      testSuiteCount: undefined
    },
    {
      status: TestSuiteStatus.passed,
      name: 'passed',
      cssClass: 'passed',
      testSuiteCount: undefined
    },
    {
      status: TestSuiteStatus.skipped,
      name: 'skipped',
      cssClass: 'skipped',
      testSuiteCount: undefined
    },
    {
      status: TestSuiteStatus.inconclusive,
      name: 'inconclusive',
      cssClass: 'inconclusive',
      testSuiteCount: undefined
    }
  ];
  totalTestSuitesCount: number;

  constructor(private testReportService: TestReportService) {}

  ngOnInit() {
    const testReports = this.testReportService.getTestReports();

    this.testSuiteCountsByStatuses.forEach(testSuiteCountByStatus => {
      testSuiteCountByStatus.testSuiteCount = 0;
    });
    this.totalTestSuitesCount = 0;

    testReports.forEach(testReport => {
      this.testSuiteCountsByStatuses.find(
        testSuiteCountByStatus => testSuiteCountByStatus.status === TestSuiteStatus.failed
      ).testSuiteCount += testReport.failedTestSuiteCount;
      this.testSuiteCountsByStatuses.find(
        testSuiteCountByStatus => testSuiteCountByStatus.status === TestSuiteStatus.passed
      ).testSuiteCount += testReport.passedTestSuiteCount;
      this.testSuiteCountsByStatuses.find(
        testSuiteCountByStatus => testSuiteCountByStatus.status === TestSuiteStatus.skipped
      ).testSuiteCount += testReport.skippedTestSuiteCount;
      this.testSuiteCountsByStatuses.find(
        testSuiteCountByStatus => testSuiteCountByStatus.status === TestSuiteStatus.inconclusive
      ).testSuiteCount += testReport.inconclusiveTestSuiteCount;

      this.totalTestSuitesCount += testReport.failedTestSuiteCount;
      this.totalTestSuitesCount += testReport.passedTestSuiteCount;
      this.totalTestSuitesCount += testReport.skippedTestSuiteCount;
      this.totalTestSuitesCount += testReport.inconclusiveTestSuiteCount;
    });
  }
}
