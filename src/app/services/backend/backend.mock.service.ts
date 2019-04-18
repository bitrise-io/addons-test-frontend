import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { BackendService, TestArtifactsResult, TestReportsResult, LogResult, TestReportResult } from './backend.model';
import { Performance } from 'src/app/models/performance.model';
import { TestArtifact, TestArtifactResponse } from 'src/app/models/test-artifact.model';
import { TestReportResponse, TestReport } from 'src/app/models/test-report.model';
import { TestSuite } from 'src/app/models/test-suite.model';
import { Log, RawLog } from 'src/app/models/log.model';

import * as MOCKED_DATA from './mock-data.json';

@Injectable()
export class MockBackendService implements BackendService {
  getPerformance(): Observable<Performance> {
    const { performance }: any = MOCKED_DATA;
    return of(performance);
  }

  getArtifacts(testReport: TestReport, testSuite: TestSuite): Observable<TestArtifactsResult> {
    if (!MOCKED_DATA[`test_report/${testReport.id}`]) {
      return of({
        testArtifacts: null,
        downloadAllURL: null
      });
    }

    const testSuiteDataForArtifact = MOCKED_DATA[`test_report/${testReport.id}`].testSuites.find(
      (testSuiteData: any) => testSuiteData.id === testSuite.id
    );
    if (!testSuiteDataForArtifact) {
      return of({
        testArtifacts: null,
        downloadAllURL: null
      });
    }

    const testArtifacts: TestArtifact[] = testSuiteDataForArtifact.testArtifacts.list.map(
      (testArtifactResponse: TestArtifactResponse) => new TestArtifact().deserialize(testArtifactResponse)
    );

    const downloadAllURL = testSuiteDataForArtifact.testArtifacts.downloadAllURL;

    return of({
      testArtifacts,
      downloadAllURL
    });
  }

  getReports(): Observable<TestReportsResult> {
    const { test_reports }: any = MOCKED_DATA;

    const testReports = test_reports.map((testReportResponse: TestReportResponse) =>
      new TestReport().deserialize(testReportResponse)
    );

    return of({ testReports });
  }

  getReportDetails(testReport: TestReport): Observable<TestReportResult> {
    const testReportResponse = MOCKED_DATA[`test_report/${testReport.id}`];
    testReport.deserialize(testReportResponse);

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
