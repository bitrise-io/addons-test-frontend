import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { Observable, of } from 'rxjs';
import { StoreModule } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';

import { ReportActions, StartPollingReports, ReceiveReports, FilterReports } from './actions';
import { ReportsReducer } from './reducer';
import { ReportEffects } from './effects';
import { provideMockStore } from 'src/app/mock-store/testing';
import { BACKEND_SERVICE, BackendService } from 'src/app/services/backend/backend.model';
import { MockBackendService } from 'src/app/services/backend/backend.mock.service';
import { ProviderService } from 'src/app/services/provider/provider.service';
import { TestSuiteStatus, TestSuite } from 'src/app/models/test-suite.model';
import { TestReport } from 'src/app/models/test-report.model';

fdescribe('Report Effects', () => {
  let actions$: Observable<ReportActions>;
  let effects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({ testReport: ReportsReducer })],
      providers: [
        ReportEffects,
        provideMockStore({
          initialState: {
            testReport: {
              filter: TestSuiteStatus.passed
            }
          }
        }),
        provideMockActions(() => actions$),
        { provide: BACKEND_SERVICE, useClass: MockBackendService },
        ProviderService
      ]
    }).compileComponents();

    effects = TestBed.get(ReportEffects);
  });

  describe('when fetching test reports', () => {
    describe('and there are no test reports', () => {
      let mockBackendService: MockBackendService;

      beforeEach(() => {
        mockBackendService = TestBed.get(BACKEND_SERVICE);
        mockBackendService.getReports = jasmine.createSpy('getReports').and.callFake(() => of({ testReports: [] }));
        mockBackendService.getReportDetails = jasmine.createSpy('getReportDetails');
      });

      it('calls getReports once, does not call getReportDetails', fakeAsync(() => {
        actions$ = of(new StartPollingReports({ buildSlug: 'test-build-slug' }));
        const subscription = effects.$fetchReports.subscribe();
        tick(6000);
        subscription.unsubscribe();

        expect(mockBackendService.getReports).toHaveBeenCalledTimes(1);
        expect(mockBackendService.getReportDetails).not.toHaveBeenCalled();
      }));
    });

    fdescribe('and there are finished test reports', () => {
      let mockBackendService: MockBackendService;

      beforeEach(() => {
        mockBackendService = TestBed.get(BACKEND_SERVICE);
        mockBackendService.getReports = jasmine.createSpy('getReports').and.callFake(() =>
          of({
            testReports: Array(3)
              .fill(null)
              .map(() => new TestReport())
          })
        );
        mockBackendService.getReportDetails = jasmine
          .createSpy('getReportDetails')
          .and.callFake((_buildSlug, testReport) => {
            testReport.testSuites = [
              TestSuiteStatus.inconclusive,
              TestSuiteStatus.passed,
              TestSuiteStatus.failed,
              TestSuiteStatus.skipped
            ].map((testSuiteStatus) => {
              const testSuite = new TestSuite();
              testSuite.status = testSuiteStatus;

              return testSuite;
            });

            return of({ testReport });
          });
      });

      it('calls getReports once, getReportDetails for each test report', fakeAsync(() => {
        actions$ = of(new StartPollingReports({ buildSlug: 'test-build-slug' }));
        const subscription = effects.$fetchReports.subscribe();
        tick(6000);
        subscription.unsubscribe();

        expect(mockBackendService.getReports).toHaveBeenCalledTimes(1);
        expect(mockBackendService.getReportDetails).toHaveBeenCalledTimes(3);
      }));
    });
  });
});
