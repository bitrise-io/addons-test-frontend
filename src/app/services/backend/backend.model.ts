import { Observable } from 'rxjs';

import { Performance } from 'src/app/models/performance.model';
import { TestArtifact } from 'src/app/models/test-artifact.model';
import { TestReport } from 'src/app/models/test-report.model';
import { Log } from 'src/app/models/log.model';
import { TestSuite } from 'src/app/models/test-suite.model';

export const BACKEND_SERVICE = 'BACKEND_SERVICE';

export interface AppResult {
  slug: string;
  name: string;
}

export interface TestArtifactsResult {
  testArtifacts: TestArtifact[];
}

export interface TestReportsResult {
  testReports: TestReport[];
}

export interface TestReportResult {
  testReport: TestReport;
}

export interface LogResult {
  logs: {
    [testReportId: string]: {
      [testSuiteId: string]: {
        log: Log;
        downloadURL?: string;
      };
    };
  };
}

export interface BackendService {
  getApp(): Observable<AppResult>;
  getPerformance(buildSlug: string, testSuite: TestSuite): Observable<Performance>;
  getReports(buildSlug: string): Observable<TestReportsResult>;
  getReportDetails(buildSlug: string, testReport: TestReport): Observable<TestReportResult>;
  getLog(testReport: TestReport, testSuite: TestSuite): Observable<LogResult>;
}
