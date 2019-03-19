import { Observable } from 'rxjs';

import { Performance } from 'src/app/models/performance.model';
import { TestArtifact } from 'src/app/models/test-artifact.model';
import { TestReport } from 'src/app/models/test-report.model';

export const BACKEND_SERVICE = 'BACKEND_SERVICE';

export interface TestArtifactsResult {
  testArtifacts: TestArtifact[];
  downloadAllURL: string;
}

export interface TestReportsResult {
  testReports: TestReport[];
}

export interface BackendService {
  getPerformace(): Observable<Performance>;
  getArtifacts(): Observable<TestArtifactsResult>;
  getReports(): Observable<TestReportsResult>;
}
