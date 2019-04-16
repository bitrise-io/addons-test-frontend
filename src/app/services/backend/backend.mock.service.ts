import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { BackendService, TestArtifactsResult, TestReportsResult, LogResult, TestReportResult } from './backend.model';
import { Performance } from 'src/app/models/performance.model';
import { TestArtifact, TestArtifactResponse } from 'src/app/models/test-artifact.model';
import { TestReportResponse, TestReport } from 'src/app/models/test-report.model';
import { Log, RawLog } from 'src/app/models/log.model';

import * as MOCKED_DATA from './mock-data.json';

@Injectable()
export class MockBackendService implements BackendService {
  getPerformance(): Observable<Performance> {
    const { performance }: any = MOCKED_DATA;
    return of(performance);
  }

  getArtifacts(): Observable<TestArtifactsResult> {
    const {
      test_artifacts: { list, downloadAllURL }
    }: any = MOCKED_DATA;

    const testArtifacts: TestArtifact[] = list.map((testArtifactResponse: TestArtifactResponse) =>
      new TestArtifact().deserialize(testArtifactResponse)
    );

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
    console.log(testReportResponse);
    testReport.deserialize(testReportResponse);

    return of({ testReport });
  }

  getLog(testReport: TestReport): Observable<LogResult> {
    const { fullLog, downloadURL }: any = MOCKED_DATA[testReport.logUrl];

    const log = new Log().deserialize(<RawLog>fullLog);

    return of({
      log,
      downloadURL
    });
  }
}
