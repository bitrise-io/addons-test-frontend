import { Injectable } from '@angular/core';
import { TestReport } from './test-report.model';

@Injectable()
export class TestReportService {
  private TEST_REPORTS = [
    {
      id: 1,
      name: 'Unit Test A',
      inconclusiveTestSuiteCount: 5,
      passedTestSuiteCount: 3,
      failedTestSuiteCount: 2,
      skippedTestSuiteCount: 0
    },
    {
      id: 2,
      name: 'Unit Test X',
      inconclusiveTestSuiteCount: 3,
      passedTestSuiteCount: 2,
      failedTestSuiteCount: 0,
      skippedTestSuiteCount: 1
    },
    {
      id: 3,
      name: 'Unit Test Y',
      inconclusiveTestSuiteCount: 7,
      passedTestSuiteCount: 4,
      failedTestSuiteCount: 1,
      skippedTestSuiteCount: 3
    }
  ];

  getTestReports(): any[] {
    return this.TEST_REPORTS.map((testReportData: any) => new TestReport().deserialize(testReportData));
  }
}
