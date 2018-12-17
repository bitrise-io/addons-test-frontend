import { Injectable } from '@angular/core';
import { TestReport, TestReportResponse } from './test-report.model';
import { TestSuiteStatus, TestSuiteOrientation } from './test-suite.model';
import { TestCaseStatus } from './test-case.model';
import * as MOCKED_DATA from './mocked-data.json';

@Injectable()
export class TestReportService {
  private TEST_REPORTS: any = (<any>MOCKED_DATA).test_reports;

  getTestReports(): TestReport[] {
    return this.TEST_REPORTS.map((testReportResponse: TestReportResponse) =>
      new TestReport().deserialize(testReportResponse)
    );
  }
}
