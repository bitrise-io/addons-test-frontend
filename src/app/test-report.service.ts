import { Injectable } from '@angular/core';
import { TestReport, TestReportResponse } from './test-report.model';
import { TestSuiteStatus } from './test-suite.model';

@Injectable()
export class TestReportService {
  private TEST_REPORTS = [
    {
      id: 1,
      name: 'Unit Test A',
      testSuites: [
        { status: TestSuiteStatus.passed },
        { status: TestSuiteStatus.passed },
        { status: TestSuiteStatus.failed },
        { status: TestSuiteStatus.inconclusive },
        { status: TestSuiteStatus.skipped },
        { status: TestSuiteStatus.passed },
        { status: TestSuiteStatus.failed }
      ]
    },
    {
      id: 2,
      name: 'Unit Test X',
      testSuites: [
        { status: TestSuiteStatus.skipped },
        { status: TestSuiteStatus.passed },
        { status: TestSuiteStatus.failed }
      ]
    },
    {
      id: 3,
      name: 'Unit Test Y',
      testSuites: [
        { status: TestSuiteStatus.passed },
        { status: TestSuiteStatus.passed },
        { status: TestSuiteStatus.failed },
        { status: TestSuiteStatus.inconclusive }
      ]
    }
  ];

  getTestReports(): TestReport[] {
    return this.TEST_REPORTS.map((testReportResponse: TestReportResponse) => new TestReport().deserialize(testReportResponse));
  }
}
