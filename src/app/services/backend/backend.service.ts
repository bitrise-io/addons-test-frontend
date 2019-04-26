import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { BackendService, TestReportsResult, LogResult, TestReportResult } from './backend.model';
import { ProviderService, Provider } from 'src/app/services/provider/provider.service';
import { Performance } from 'src/app/models/performance.model';
import { TestReportResponse, TestReport } from 'src/app/models/test-report.model';
import { TestSuite } from 'src/app/models/test-suite.model';
import { Log, RawLog } from 'src/app/models/log.model';

import * as MOCKED_DATA from './mock-data.json';

@Injectable()
export class RealBackendService implements BackendService {
  constructor(private httpClient: HttpClient, private providerService: ProviderService) {}

  getPerformance(): Observable<Performance> {
    const { performance }: any = MOCKED_DATA;
    return of(performance);
  }

  getReports(): Observable<TestReportsResult> {
    const { test_reports }: any = MOCKED_DATA;

    const testReports = test_reports.map((testReportResponse: TestReportResponse) =>
      new TestReport().deserialize(testReportResponse)
    );

    return of({ testReports });
  }

  getReportDetails(testReport: TestReport): Observable<TestReportResult> {
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
    const fullLog = MOCKED_DATA[testSuite.logUrl];
    const log = new Log().deserialize(<RawLog>fullLog);

    return of({
      logs: {
        [testReport.id]: {
          [testSuite.id]: {
            log
          }
        }
      }
    });
  }
}
