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
  public testSuiteStatus = TestSuiteStatus;
  testReports: TestReport[];
  testSuitesByStatuses: {
    status: number;
    statusName: string;
    cssClass: string;
    count: number;
  }[] = [
    {
      status: TestSuiteStatus.failed,
      statusName: 'failed',
      cssClass: 'failed',
      count: undefined
    },
    {
      status: TestSuiteStatus.passed,
      statusName: 'passed',
      cssClass: 'passed',
      count: undefined
    },
    {
      status: TestSuiteStatus.skipped,
      statusName: 'skipped',
      cssClass: 'skipped',
      count: undefined
    },
    {
      status: TestSuiteStatus.inconclusive,
      statusName: 'inconclusive',
      cssClass: 'inconclusive',
      count: undefined
    }
  ];
  totalTestSuitesCount: number;

  constructor(private testReportService: TestReportService) {}

  ngOnInit() {
    const testReports = this.testReportService.getTestReports();

    this.testSuitesByStatuses.forEach(testSuitesByStatus => {
      testSuitesByStatus.count = 0;
    });
    this.totalTestSuitesCount = 0;

    testReports.forEach(testReport => {
      this.testSuitesByStatuses.find(
        testSuitesByStatus => testSuitesByStatus.status === TestSuiteStatus.failed
      ).count += testReport.failedTestSuiteCount;
      this.testSuitesByStatuses.find(
        testSuitesByStatus => testSuitesByStatus.status === TestSuiteStatus.passed
      ).count += testReport.passedTestSuiteCount;
      this.testSuitesByStatuses.find(
        testSuitesByStatus => testSuitesByStatus.status === TestSuiteStatus.skipped
      ).count += testReport.skippedTestSuiteCount;
      this.testSuitesByStatuses.find(
        testSuitesByStatus => testSuitesByStatus.status === TestSuiteStatus.inconclusive
      ).count += testReport.inconclusiveTestSuiteCount;

      this.totalTestSuitesCount += testReport.failedTestSuiteCount;
      this.totalTestSuitesCount += testReport.passedTestSuiteCount;
      this.totalTestSuitesCount += testReport.skippedTestSuiteCount;
      this.totalTestSuitesCount += testReport.inconclusiveTestSuiteCount;
    });
  }
}
