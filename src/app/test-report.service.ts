import { Injectable } from '@angular/core';
import { TestReport } from './test-report.model';

@Injectable()
export class TestReportService {
  private TEST_REPORTS = [
    {
      id: 1,
      name: 'Unit Test A',
      testSuites: [
        { status: 1 },
        { status: 1 },
        { status: 2 },
        { status: 0 },
        { status: 3 },
        { status: 1 },
        { status: 2 }
      ]
    },
    {
      id: 2,
      name: 'Unit Test X',
      testSuites: [
        { status: 3 },
        { status: 1 },
        { status: 2 }
      ]
    },
    {
      id: 3,
      name: 'Unit Test Y',
      testSuites: [
        { status: 1 },
        { status: 1 },
        { status: 2 },
        { status: 0 }
      ]
    }
  ];

  getTestReports(): TestReport[] {
    return this.TEST_REPORTS.map((testReportData: any) => new TestReport().deserialize(testReportData));
  }
}
