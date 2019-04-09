import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { BackendService, TestArtifactsResult, TestReportsResult, LogResult } from './backend.model';
import { Performance } from 'src/app/models/performance.model';
import { TestArtifact, TestArtifactResponse } from 'src/app/models/test-artifact.model';
import { TestReportResponse, TestReport } from 'src/app/models/test-report.model';
import { Log, LogResponse } from 'src/app/models/log.model';

import * as MOCKED_DATA from './mock-data.json';

@Injectable()
export class RealBackendService implements BackendService {
  constructor(private httpClient: HttpClient) {}

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

  getLog(): Observable<LogResult> {
    const {
      log: { fullLogIos, downloadURL }
    }: any = MOCKED_DATA;

    const log = new Log().deserialize(<LogResponse>fullLogIos);

    return of({
      log,
      downloadURL
    });
  }
}
