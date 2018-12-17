import { Injectable } from '@angular/core';
import { TestReport, TestReportResponse } from './test-report.model';
import * as MOCKED_DATA from './mocked-data.json';

@Injectable()
export class TestReportService {
  private testReportResponses = MOCKED_DATA['test_reports'];

  getTestReports(): TestReport[] {
    return this.testReportResponses.map((testReportResponse: TestReportResponse) =>
      new TestReport().deserialize(testReportResponse)
    );
  }
}
