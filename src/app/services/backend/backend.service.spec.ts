import { TestBed, fakeAsync } from '@angular/core/testing';

import { BackendService, BACKEND_SERVICE, TestArtifactsResult, TestReportsResult, LogResult } from './backend.model';
import { MockServicesModule } from '../services.mock.module';

import { Performance } from 'src/app/models/performance.model';

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
      service.getArtifacts().subscribe((result: TestArtifactsResult) => {
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

        keys = Object.keys(result.testReports[1]);
        expect(keys).toContain('testSuites');
      });
    });

    it('should load log data', () => {
      service.getLog().subscribe((logResult: LogResult) => {
        const keys = Object.keys(logResult);
        expect(keys).toContain('log');
        expect(keys).toContain('downloadURL');
      });
    });
  });
});
