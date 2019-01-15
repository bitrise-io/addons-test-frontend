import { Component, Input, OnInit } from '@angular/core';
import { TestSuite } from 'src/app/models/test-suite.model';
import { TestCase, TestCaseStatus } from 'src/app/models/test-case.model';

@Component({
  selector: 'bitrise-test-suite-details-header',
  templateUrl: 'test-suite-details-header.component.html',
  styleUrls: ['test-suite-details-header.component.scss']
})
export class TestSuiteDetailsHeaderComponent implements OnInit {
  @Input() testSuite: TestSuite;

  TestCase = TestCase;

  orderedTestCaseStatuses = [TestCaseStatus.failed, TestCaseStatus.passed];
  testCaseCountsByStatuses: {
    [status: number]: number;
  };
  totalTestCaseCount: number;

  ngOnInit() {
    this.testCaseCountsByStatuses = this.orderedTestCaseStatuses.reduce(
      (sumByStatus, status: TestCaseStatus) => ({
        ...sumByStatus,
        [status]: this.testSuite.testCases.filter((testCase: TestCase) => testCase.status == status).length
      }),
      {}
    );

    this.totalTestCaseCount = this.orderedTestCaseStatuses.reduce(
      (sumByStatus, status: TestCaseStatus) => sumByStatus + this.testCaseCountsByStatuses[status],
      0
    );
  }
}
