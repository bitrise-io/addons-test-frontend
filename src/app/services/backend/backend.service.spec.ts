import { TestBed } from '@angular/core/testing';

import {
  BackendService,
  BACKEND_SERVICE,
  TestArtifactsResult,
  TestReportsResult,
  LogResult,
  TestReportResult
} from './backend.model';
import { MockServicesModule } from '../services.mock.module';

import { TestReport } from 'src/app/models/test-report.model';
import { TestSuite } from 'src/app/models/test-suite.model';
import { Performance } from 'src/app/models/performance.model';
import { TestArtifact } from 'src/app/models/test-artifact.model';

describe('BackendService', () => {
  let service: BackendService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MockServicesModule]
    });

    service = TestBed.get(BACKEND_SERVICE);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('mock data shape', () => {
    it('should load performance data', () => {
      service.getPerformance().subscribe((performance: Performance) => {
        let keys = Object.keys(performance);
        expect(keys).toContain('metrics');
        expect(keys).toContain('durationInMilliseconds');

        keys = Object.keys(performance.metrics);
        expect(keys).toContain('cpu');
        expect(keys).toContain('memory');
        expect(keys).toContain('network');

        keys = Object.keys(performance.metrics.cpu);
        expect(keys).toContain('name');
        expect(keys).toContain('currentTimeInMilliseconds');
        expect(keys).toContain('sampleGroups');
      });
    });

    it('should load artifact data', () => {
      const testReport = new TestReport();
      testReport.id = 2;

      const testSuite = new TestSuite();
      testSuite.id = 5;

      service.getArtifacts(testReport, testSuite).subscribe((result: TestArtifactsResult) => {
        let keys = Object.keys(result);
        expect(keys).toContain('testArtifacts');
        expect(keys).toContain('downloadAllURL');

        keys = Object.keys(result.testArtifacts[0]);
        expect(keys).toContain('filename');
        expect(keys).toContain('downloadURL');
      });
    });

    it('should load report data', () => {
      service.getReports().subscribe((result: TestReportsResult) => {
        let keys = Object.keys(result);
        expect(keys).toContain('testReports');

        keys = Object.keys(result.testReports[0]);
        expect(keys).toContain('id');
        expect(keys).toContain('name');
        expect(keys).not.toContain('testSuites');
      });
    });

    it('should load report details', () => {
      const testReport = new TestReport();
      testReport.id = 1;

      service.getReportDetails(testReport).subscribe((result: TestReportResult) => {
        let keys = Object.keys(result);
        expect(keys).toContain('testReport');

        keys = Object.keys(result.testReport);
        expect(keys).toContain('id');
        expect(keys).toContain('name');
        expect(keys).toContain('testSuites');
      });
    });

    it('should load log data', () => {
      const testReport = new TestReport();
      testReport.id = 1;

      const testSuite = new TestSuite();
      testSuite.id = 2;
      testSuite.logUrl = 'log1';

      testReport.testSuites = [testSuite];

      service.getLog(testReport, testSuite).subscribe((logResult: LogResult) => {
        const keys = Object.keys(logResult);
        expect(keys).toContain('logs');
        expect(Object.keys(logResult.logs)).toContain('1');
        expect(Object.keys(logResult.logs['1'])).toContain('2');
        expect(Object.keys(logResult.logs['1']['2'])).toContain('log');
        expect(Object.keys(logResult.logs['1']['2'])).toContain('downloadURL');
      });
    });
  });
});
