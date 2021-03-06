import { TestBed } from '@angular/core/testing';

import {
  BackendService,
  BACKEND_SERVICE,
  TestReportsResult,
  LogResult,
  TestReportResult
} from './backend.model';
import { MockServicesModule } from '../services.mock.module';

import { TestReport } from 'src/app/models/test-report.model';
import { TestSuite } from 'src/app/models/test-suite.model';
import { Performance } from 'src/app/models/performance.model';
import { ProviderService } from 'src/app/services/provider/provider.service';
import { Log } from 'src/app/models/log.model';

describe('BackendService', () => {
  let service: BackendService;
  const mockProviderService = new ProviderService();
  const buildSlug = 'abcdefgh12345678';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MockServicesModule],
      providers: [
        {
          provide: ProviderService,
          useValue: mockProviderService
        }
      ]
    });

    service = TestBed.get(BACKEND_SERVICE);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('mock data shape', () => {
    it('should load performance data', () => {
      const testSuite = new TestSuite();

      service.getPerformance(buildSlug, testSuite).subscribe((performance: Performance) => {
        const keys = Object.keys(performance);
        expect(keys).toContain('cpu_samples');
        expect(keys).toContain('ram_samples');
        expect(keys).toContain('nwu_samples');
        expect(keys).toContain('nwd_samples');
      });
    });

    it('should load report data', () => {
      service.getReports(buildSlug).subscribe((result: TestReportsResult) => {
        let keys = Object.keys(result);
        expect(keys).toContain('testReports');

        keys = Object.keys(result.testReports[0]);
        expect(keys).toContain('id');
        expect(keys).toContain('name');
        expect(keys).not.toContain('testSuites');
      });
    });

    it('should load report details, set test report with it', () => {
      const testReport = new TestReport();
      testReport.id = '1';
      testReport.name = 'test report';

      mockProviderService.deserializeTestReportDetails = jasmine
        .createSpy('deserializeTestReportDetails')
        .and.callFake(() => { testReport.testSuites = []; });

      service.getReportDetails(buildSlug, testReport).subscribe((result: TestReportResult) => {
        let keys = Object.keys(result);
        expect(keys).toContain('testReport');

        keys = Object.keys(result.testReport);
        expect(keys).toContain('id');
        expect(keys).toContain('name');
        expect(keys).toContain('testSuites');
      });
    });

    it('should load log data', () => {
      spyOn(Log.prototype, 'deserialize').and.returnValue(new Log());

      const testReport = new TestReport();
      testReport.id = '1';

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
