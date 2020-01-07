import { TestBed, fakeAsync, tick, inject } from '@angular/core/testing';

import { Observable, of } from 'rxjs';
import { StoreModule, Store } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';

import { ReportActions, StartPollingReports, ReportActionTypes } from './actions';
import { ReportsReducer, TestReportState } from './reducer';
import { ReportEffects } from './effects';
import { provideMockStore, MockStore } from 'src/app/mock-store/testing';
import { BACKEND_SERVICE } from 'src/app/services/backend/backend.model';
import { MockBackendService } from 'src/app/services/backend/backend.mock.service';
import { ProviderService } from 'src/app/services/provider/provider.service';
import { TestSuiteStatus, TestSuite } from 'src/app/models/test-suite.model';
import { TestReport } from 'src/app/models/test-report.model';
import { delay } from 'rxjs/operators';

const testSuiteWithStatus = (testSuiteStatus: TestSuiteStatus) => {
  const testSuite = new TestSuite();
  testSuite.status = testSuiteStatus;

  return testSuite;
};

fdescribe('Report Effects', () => {
  let store: MockStore<{ testReport: TestReportState }>;
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
      it('calls getReports once, does not call getReportDetails', fakeAsync(() => {
        const mockBackendService = TestBed.get(BACKEND_SERVICE);
        mockBackendService.getReports = jasmine.createSpy('getReports').and.callFake(() => of({ testReports: [] }));
        mockBackendService.getReportDetails = jasmine.createSpy('getReportDetails');

        actions$ = of(new StartPollingReports({ buildSlug: 'test-build-slug' }));
        const subscription = effects.$fetchReports.subscribe();
        tick(6000);
        subscription.unsubscribe();

        expect(mockBackendService.getReports).toHaveBeenCalledTimes(1);
        expect(mockBackendService.getReportDetails).not.toHaveBeenCalled();
      }));
    });

    describe('and there are only finished test reports', () => {
      it('calls getReports once, getReportDetails for each test report', fakeAsync(() => {
        const testReports = Array(3)
          .fill(null)
          .map(() => new TestReport());
        const mockBackendService = TestBed.get(BACKEND_SERVICE);
        mockBackendService.getReports = jasmine.createSpy('getReports').and.callFake(() =>
          of({
            testReports: testReports
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
            ].map(testSuiteWithStatus);

            return of({ testReport });
          });

        actions$ = of(new StartPollingReports({ buildSlug: 'test-build-slug' }));
        const subscription = effects.$fetchReports.subscribe();
        tick(1000);

        expect(mockBackendService.getReports).toHaveBeenCalledTimes(1);
        expect(mockBackendService.getReportDetails).toHaveBeenCalledTimes(3);
        expect(mockBackendService.getReportDetails).toHaveBeenCalledWith('test-build-slug', testReports[0]);
        expect(mockBackendService.getReportDetails).toHaveBeenCalledWith('test-build-slug', testReports[1]);
        expect(mockBackendService.getReportDetails).toHaveBeenCalledWith('test-build-slug', testReports[2]);

        mockBackendService.getReports.calls.reset();
        mockBackendService.getReportDetails.calls.reset();

        tick(5000);
        subscription.unsubscribe();

        expect(mockBackendService.getReports).not.toHaveBeenCalled();
        expect(mockBackendService.getReportDetails).not.toHaveBeenCalled();
      }));
    });

    describe('and there are some in-progress test reports', () => {
      it('calls getReports once, getReportDetails for each test report once, plus periodically until in-progress test reports finish', fakeAsync(() => {
        const testReports = Array(3)
          .fill(null)
          .map(() => new TestReport());
        const mockBackendService = TestBed.get(BACKEND_SERVICE);
        mockBackendService.getReports = jasmine.createSpy('getReports').and.callFake(() =>
          of({
            testReports: testReports
          })
        );
        const inProgressTestSuite = testSuiteWithStatus(TestSuiteStatus.inProgress);
        setTimeout(() => {
          inProgressTestSuite.status = TestSuiteStatus.passed;
        }, 11000);

        mockBackendService.getReportDetails = jasmine
          .createSpy('getReportDetails')
          .and.callFake((_buildSlug, testReport) => {
            testReport.testSuites = [
              TestSuiteStatus.inconclusive,
              TestSuiteStatus.passed,
              TestSuiteStatus.failed,
              TestSuiteStatus.skipped
            ].map(testSuiteWithStatus);

            if (testReport === testReports[0]) {
              testReport.testSuites.push(inProgressTestSuite);
            }

            return of({ testReport });
          });

        actions$ = of(new StartPollingReports({ buildSlug: 'test-build-slug' }));
        const subscription = effects.$fetchReports.subscribe();
        tick(1000);

        expect(mockBackendService.getReports).toHaveBeenCalledTimes(1);
        expect(mockBackendService.getReportDetails).toHaveBeenCalledTimes(3);
        expect(mockBackendService.getReportDetails).toHaveBeenCalledWith('test-build-slug', testReports[0]);
        expect(mockBackendService.getReportDetails).toHaveBeenCalledWith('test-build-slug', testReports[1]);
        expect(mockBackendService.getReportDetails).toHaveBeenCalledWith('test-build-slug', testReports[2]);

        mockBackendService.getReports.calls.reset();
        mockBackendService.getReportDetails.calls.reset();

        tick(5000);

        expect(mockBackendService.getReports).not.toHaveBeenCalled();
        expect(mockBackendService.getReportDetails).toHaveBeenCalledTimes(3);
        expect(mockBackendService.getReportDetails).toHaveBeenCalledWith('test-build-slug', testReports[0]);
        expect(mockBackendService.getReportDetails).toHaveBeenCalledWith('test-build-slug', testReports[1]);
        expect(mockBackendService.getReportDetails).toHaveBeenCalledWith('test-build-slug', testReports[2]);

        mockBackendService.getReports.calls.reset();
        mockBackendService.getReportDetails.calls.reset();

        tick(5000);

        expect(mockBackendService.getReports).not.toHaveBeenCalled();
        expect(mockBackendService.getReportDetails).toHaveBeenCalledTimes(3);
        expect(mockBackendService.getReportDetails).toHaveBeenCalledWith('test-build-slug', testReports[0]);
        expect(mockBackendService.getReportDetails).toHaveBeenCalledWith('test-build-slug', testReports[1]);
        expect(mockBackendService.getReportDetails).toHaveBeenCalledWith('test-build-slug', testReports[2]);

        mockBackendService.getReports.calls.reset();
        mockBackendService.getReportDetails.calls.reset();

        tick(5000);

        expect(mockBackendService.getReports).not.toHaveBeenCalled();
        expect(mockBackendService.getReportDetails).not.toHaveBeenCalled();

        subscription.unsubscribe();
      }));
    });

    describe('and filter is set to a state', () => {
      beforeEach(inject([Store], (mockStore: MockStore<{ testReport: TestReportState }>) => {
        store = mockStore;
      }));

      it('emits all received reports, emits filter state', fakeAsync(() => {
        const testReports = Array(3)
          .fill(null)
          .map(() => new TestReport());

        store.setState({
          testReport: {
            testReports: testReports,
            filteredReports: testReports,
            filter: TestSuiteStatus.failed
          }
        });

        const mockBackendService = TestBed.get(BACKEND_SERVICE);
        mockBackendService.getReports = () => of({ testReports: testReports });
        mockBackendService.getReportDetails = (_buildSlug, testReport) => {
          if (testReport === testReports[0]) {
            testReport.testSuites = testSuiteWithStatus(TestSuiteStatus.passed);
          } else if (testReport === testReports[1]) {
            testReport.testSuites = testSuiteWithStatus(TestSuiteStatus.failed);
          } else if (testReport === testReports[2]) {
            testReport.testSuites = testSuiteWithStatus(TestSuiteStatus.inProgress);
          }

          return of({ testReport });
        };

        actions$ = of(new StartPollingReports({ buildSlug: 'test-build-slug' }));
        const subscription = effects.$fetchReports.subscribe(({ payload, type }) => {
          if (type === ReportActionTypes.Receive) {
            expect(payload.testReports).toEqual(testReports);
          } else if (type === ReportActionTypes.Filter) {
            expect(payload.filter).toEqual(TestSuiteStatus.failed);
          }
        });

        tick(1000);

        subscription.unsubscribe();
      }));
    });

    describe('and filter is set to a state, but changes during getReports', () => {
      beforeEach(inject([Store], (mockStore: MockStore<{ testReport: TestReportState }>) => {
        store = mockStore;
      }));

      it('emits all received reports, emits new filter state, does not re-call getReports', fakeAsync(() => {
        const testReports = Array(3)
          .fill(null)
          .map(() => new TestReport());

        store.setState({
          testReport: {
            testReports: undefined,
            filteredReports: undefined,
            filter: TestSuiteStatus.failed
          }
        });

        const mockBackendService = TestBed.get(BACKEND_SERVICE);
        mockBackendService.getReports = jasmine
          .createSpy('getReports')
          .and.callFake((_buildSlug) => of({ testReports: testReports }).pipe(delay(1500)));
        mockBackendService.getReportDetails = jasmine
          .createSpy('getReportDetails')
          .and.callFake((_buildSlug, testReport) => {
            testReport.testSuites = [testSuiteWithStatus(TestSuiteStatus.passed)];

            return of({ testReport });
          });

        actions$ = of(new StartPollingReports({ buildSlug: 'test-build-slug' }));
        let emits = [];
        const subscription = effects.$fetchReports.subscribe(({ payload, type }) => {
          emits.push({ payload, type });
        });

        tick(1000);

        expect(mockBackendService.getReports).toHaveBeenCalledTimes(1);
        expect(mockBackendService.getReportDetails).not.toHaveBeenCalled();
        expect(emits.length).toBe(0);

        mockBackendService.getReports.calls.reset();
        mockBackendService.getReportDetails.calls.reset();
        emits = [];

        store.setState({
          testReport: {
            testReports: testReports,
            filteredReports: testReports,
            filter: TestSuiteStatus.passed
          }
        });

        tick(1000);

        expect(mockBackendService.getReports).not.toHaveBeenCalled();
        expect(mockBackendService.getReportDetails).toHaveBeenCalledTimes(3);
        expect(mockBackendService.getReportDetails).toHaveBeenCalledWith('test-build-slug', testReports[0]);
        expect(mockBackendService.getReportDetails).toHaveBeenCalledWith('test-build-slug', testReports[1]);
        expect(mockBackendService.getReportDetails).toHaveBeenCalledWith('test-build-slug', testReports[2]);

        expect(emits.length).toBe(2);
        expect(emits[0]).toEqual({ type: ReportActionTypes.Receive, payload: { testReports } });
        expect(emits[1]).toEqual({ type: ReportActionTypes.Filter, payload: { filter: TestSuiteStatus.passed } });

        subscription.unsubscribe();
      }));
    });

    describe('and filter is set to a state, but changes during the period interval', () => {
      beforeEach(inject([Store], (mockStore: MockStore<{ testReport: TestReportState }>) => {
        store = mockStore;
      }));

      it('emits all received reports, emits old filter state, then new filter state after period interval, does not re-call getReports & getReportDetails', fakeAsync(() => {
        const testReports = Array(3)
          .fill(null)
          .map(() => new TestReport());

        store.setState({
          testReport: {
            testReports: undefined,
            filteredReports: undefined,
            filter: TestSuiteStatus.failed
          }
        });

        const mockBackendService = TestBed.get(BACKEND_SERVICE);
        mockBackendService.getReports = jasmine
          .createSpy('getReports')
          .and.callFake((_buildSlug) => of({ testReports: testReports }));
        mockBackendService.getReportDetails = jasmine
          .createSpy('getReportDetails')
          .and.callFake((_buildSlug, testReport) => {
            if (testReport === testReports[0]) {
              testReport.testSuites = [testSuiteWithStatus(TestSuiteStatus.passed)];
            } else if (testReport === testReports[1]) {
              testReport.testSuites = [testSuiteWithStatus(TestSuiteStatus.failed)];
            } else if (testReport === testReports[2]) {
              testReport.testSuites = [testSuiteWithStatus(TestSuiteStatus.inProgress)];
            }

            return of({ testReport });
          });

        actions$ = of(new StartPollingReports({ buildSlug: 'test-build-slug' }));
        let emits = [];
        const subscription = effects.$fetchReports.subscribe(({ payload, type }) => {
          emits.push({ payload, type });
        });

        tick(1000);

        expect(mockBackendService.getReports).toHaveBeenCalledTimes(1);
        expect(mockBackendService.getReportDetails).toHaveBeenCalledTimes(3);
        expect(mockBackendService.getReportDetails).toHaveBeenCalledWith('test-build-slug', testReports[0]);
        expect(mockBackendService.getReportDetails).toHaveBeenCalledWith('test-build-slug', testReports[1]);
        expect(mockBackendService.getReportDetails).toHaveBeenCalledWith('test-build-slug', testReports[2]);

        expect(emits.length).toBe(2);
        expect(emits[0]).toEqual({ type: ReportActionTypes.Receive, payload: { testReports } });
        expect(emits[1]).toEqual({ type: ReportActionTypes.Filter, payload: { filter: TestSuiteStatus.failed } });

        mockBackendService.getReports.calls.reset();
        mockBackendService.getReportDetails.calls.reset();
        emits = [];

        store.setState({
          testReport: {
            testReports: testReports,
            filteredReports: testReports,
            filter: TestSuiteStatus.passed
          }
        });

        tick(5000);

        expect(mockBackendService.getReports).not.toHaveBeenCalled();
        expect(mockBackendService.getReportDetails).toHaveBeenCalledTimes(3);
        expect(mockBackendService.getReportDetails).toHaveBeenCalledWith('test-build-slug', testReports[0]);
        expect(mockBackendService.getReportDetails).toHaveBeenCalledWith('test-build-slug', testReports[1]);
        expect(mockBackendService.getReportDetails).toHaveBeenCalledWith('test-build-slug', testReports[2]);

        expect(emits.length).toBe(2);
        expect(emits[0]).toEqual({ type: ReportActionTypes.Receive, payload: { testReports } });
        expect(emits[1]).toEqual({ type: ReportActionTypes.Filter, payload: { filter: TestSuiteStatus.passed } });

        subscription.unsubscribe();
      }));
    });

    describe('and filter is set to a state, but changes during getReportDetails', () => {
      beforeEach(inject([Store], (mockStore: MockStore<{ testReport: TestReportState }>) => {
        store = mockStore;
      }));

      it('emits all received reports, emits new filter state, does not re-call getReports & getReportDetails', fakeAsync(() => {
        const testReports = Array(3)
          .fill(null)
          .map(() => new TestReport());

        store.setState({
          testReport: {
            testReports: undefined,
            filteredReports: undefined,
            filter: TestSuiteStatus.failed
          }
        });

        const mockBackendService = TestBed.get(BACKEND_SERVICE);
        mockBackendService.getReports = jasmine
          .createSpy('getReports')
          .and.callFake((_buildSlug) => of({ testReports: testReports }));
        mockBackendService.getReportDetails = jasmine
          .createSpy('getReportDetails')
          .and.callFake((_buildSlug, testReport) => {
            testReport.testSuites = [testSuiteWithStatus(TestSuiteStatus.passed)];

            return of({ testReport }).pipe(delay(1500));
          });

        actions$ = of(new StartPollingReports({ buildSlug: 'test-build-slug' }));
        let emits = [];
        const subscription = effects.$fetchReports.subscribe(({ payload, type }) => {
          emits.push({ payload, type });
        });

        tick(1000);

        expect(mockBackendService.getReports).toHaveBeenCalledTimes(1);
        expect(mockBackendService.getReportDetails).toHaveBeenCalledTimes(3);
        expect(mockBackendService.getReportDetails).toHaveBeenCalledWith('test-build-slug', testReports[0]);
        expect(mockBackendService.getReportDetails).toHaveBeenCalledWith('test-build-slug', testReports[1]);
        expect(mockBackendService.getReportDetails).toHaveBeenCalledWith('test-build-slug', testReports[2]);
        expect(emits.length).toBe(0);

        mockBackendService.getReports.calls.reset();
        mockBackendService.getReportDetails.calls.reset();
        emits = [];

        store.setState({
          testReport: {
            testReports: testReports,
            filteredReports: testReports,
            filter: TestSuiteStatus.passed
          }
        });

        tick(1000);

        expect(mockBackendService.getReports).not.toHaveBeenCalled();
        expect(mockBackendService.getReportDetails).not.toHaveBeenCalled();
        expect(emits.length).toBe(2);
        expect(emits[0]).toEqual({ type: ReportActionTypes.Receive, payload: { testReports } });
        expect(emits[1]).toEqual({ type: ReportActionTypes.Filter, payload: { filter: TestSuiteStatus.passed } });

        subscription.unsubscribe();
      }));
    });
  });
});
