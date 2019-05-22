import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { BackendService, TestReportsResult, LogResult, TestReportResult, AppResult } from './backend.model';
import { ProviderService, Provider } from 'src/app/services/provider/provider.service';
import { Performance } from 'src/app/models/performance.model';
import { TestReportResponse, TestReport } from 'src/app/models/test-report.model';
import { TestSuite } from 'src/app/models/test-suite.model';
import { Log, RawLog } from 'src/app/models/log.model';

import * as MOCKED_DATA from './mock-data.json';

@Injectable()
export class MockBackendService implements BackendService {
  constructor(private providerService: ProviderService) {}

  getApp(): Observable<AppResult> {
    return of(MOCKED_DATA['app']);
  }

  getPerformance(buildSlug: string, testSuite: TestSuite): Observable<Performance> {
    const { performance }: any = MOCKED_DATA;
    return of(performance);
  }

  getReports(buildSlug: string): Observable<TestReportsResult> {
    const { test_reports }: any = MOCKED_DATA;

    const testReports = test_reports.map((testReportResponse: TestReportResponse) =>
      new TestReport().deserialize(testReportResponse)
    );

    return of({ testReports });
  }

  getReportDetails(buildSlug: string, testReport: TestReport): Observable<TestReportResult> {
    const testReportDetailsResponse = MOCKED_DATA[`test_report/${testReport.id}`];
    this.providerService.deserializeTestReportDetails(testReportDetailsResponse, testReport);

    if (testReport.provider === Provider.firebaseTestlab) {
      testReport.testSuites.forEach((testSuite: TestSuite) => {
        const testCasesResponse = MOCKED_DATA[testSuite.testCasesURL];
        testSuite.testCases = this.providerService.deserializeFirebaseTestlabTestCases(testCasesResponse);
      });
    }

    return of({ testReport });
  }

  getLog(testReport: TestReport, testSuite: TestSuite): Observable<LogResult> {
    const { fullLog, downloadURL }: any = MOCKED_DATA[testSuite.logUrl];
    const log = new Log().deserialize(<RawLog>fullLog);

    return of({
      logs: {
        [testReport.id]: {
          [testSuite.id]: {
            log,
            downloadURL
          }
        }
      }
    });
  }
}
