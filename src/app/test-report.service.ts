import { Injectable } from '@angular/core';
import { TestReport } from './test-report.model';

@Injectable()
export class TestReportService {
  private TEST_REPORTS = [
    { id: 1, name: 'Unit Test A', failedTestCaseCount: 2 },
    { id: 2, name: 'Unit Test X', failedTestCaseCount: 0 },
    { id: 3, name: 'Unit Test Y', failedTestCaseCount: 1 }
  ];

  getTestReports(): any[] {
    return this.TEST_REPORTS.map((testReportData: any) => new TestReport().deserialize(testReportData));
  }
}
