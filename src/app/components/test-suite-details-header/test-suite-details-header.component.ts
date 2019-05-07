import { Component, Input, OnInit } from '@angular/core';
import { TestReport, TestReportType } from 'src/app/models/test-report.model';
import { TestSuite } from 'src/app/models/test-suite.model';
import { TestCase, TestCaseStatus } from 'src/app/models/test-case.model';

@Component({
  selector: 'bitrise-test-suite-details-header',
  templateUrl: 'test-suite-details-header.component.html',
  styleUrls: ['test-suite-details-header.component.scss']
})
export class TestSuiteDetailsHeaderComponent implements OnInit {
  @Input() testReport: TestReport;
  @Input() testSuite: TestSuite;
  @Input() previousTestSuite: TestSuite;
  @Input() nextTestSuite: TestSuite;

  TestReportType = TestReportType;
  TestCase = TestCase;

  orderedTestCaseStatuses = [TestCaseStatus.failed, TestCaseStatus.passed, TestCaseStatus.skipped];
  testCaseCountsByStatuses: {
    [status: number]: number;
  };
  totalTestCaseCount: number;

  ngOnInit() {
    this.testCaseCountsByStatuses = this.orderedTestCaseStatuses.reduce(
      (sumByStatus, status: TestCaseStatus) => ({
        ...sumByStatus,
        [status]: this.testSuite.testCases.filter((testCase: TestCase) => testCase.status === status).length
      }),
      {}
    );

    this.totalTestCaseCount = this.orderedTestCaseStatuses.reduce(
      (sumByStatus, status: TestCaseStatus) => sumByStatus + this.testCaseCountsByStatuses[status],
      0
    );
  }
}
