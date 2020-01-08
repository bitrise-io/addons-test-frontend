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
import { delay, map } from 'rxjs/operators';

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

        let isInProgressTestSuiteFinished = false;
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
              testReport.testSuites.push(
                testSuiteWithStatus(isInProgressTestSuiteFinished ? TestSuiteStatus.passed : TestSuiteStatus.inProgress)
              );
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

        isInProgressTestSuiteFinished = true;
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

    describe('and getReportDetails takes a significant amount of time', () => {
      it('only starts period interval countdown after getReportDetails has finished', fakeAsync(() => {
        const testReport = new TestReport();
        const inProgressTestSuite = testSuiteWithStatus(TestSuiteStatus.inProgress);
        const mockBackendService = TestBed.get(BACKEND_SERVICE);
        mockBackendService.getReports = jasmine
          .createSpy('getReports')
          .and.callFake(() => of({ testReports: [testReport] }));
        mockBackendService.getReportDetails = jasmine
          .createSpy('getReportDetails')
          .and.callFake((_buildSlug, testReport) =>
            of({ testReport })
              .pipe(delay(2000))
              .pipe(
                map(() => {
                  testReport.testSuites = [inProgressTestSuite];

                  return { testReport };
                })
              )
          );

        actions$ = of(new StartPollingReports({ buildSlug: 'test-build-slug' }));
        const subscription = effects.$fetchReports.subscribe();
        tick(1000);

        expect(mockBackendService.getReports).toHaveBeenCalledTimes(1);
        expect(mockBackendService.getReportDetails).toHaveBeenCalledTimes(1);
        expect(mockBackendService.getReportDetails).toHaveBeenCalledWith('test-build-slug', testReport);

        mockBackendService.getReportDetails.calls.reset();

        tick(5000);

        expect(mockBackendService.getReportDetails).not.toHaveBeenCalled();

        inProgressTestSuite.status = TestSuiteStatus.passed;
        mockBackendService.getReportDetails.calls.reset();
        tick(6000);
        expect(mockBackendService.getReportDetails).toHaveBeenCalledTimes(1);
        expect(mockBackendService.getReportDetails).toHaveBeenCalledWith('test-build-slug', testReport);

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
            testReport.testSuites = [testSuiteWithStatus(TestSuiteStatus.inconclusive)];
          } else if (testReport === testReports[1]) {
            testReport.testSuites = [testSuiteWithStatus(TestSuiteStatus.passed)];
          } else if (testReport === testReports[2]) {
            testReport.testSuites = [testSuiteWithStatus(TestSuiteStatus.failed)];
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
        let isInProgressTestSuiteFinished = false;
        mockBackendService.getReportDetails = jasmine
          .createSpy('getReportDetails')
          .and.callFake((_buildSlug, testReport) => {
            if (testReport === testReports[0]) {
              testReport.testSuites = [testSuiteWithStatus(TestSuiteStatus.passed)];
            } else if (testReport === testReports[1]) {
              testReport.testSuites = [testSuiteWithStatus(TestSuiteStatus.failed)];
            } else if (testReport === testReports[2]) {
              testReport.testSuites = [
                testSuiteWithStatus(isInProgressTestSuiteFinished ? TestSuiteStatus.passed : TestSuiteStatus.inProgress)
              ];
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

        isInProgressTestSuiteFinished = true;
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
            return of({ testReport })
              .pipe(delay(1500))
              .pipe(
                map(() => {
                  testReport.testSuites = [testSuiteWithStatus(TestSuiteStatus.passed)];
                })
              );
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

    describe('and a new fetch report starts before the previous is finished', () => {
      it('emits the result of the new fetch, does not emit the result of the old fetch', fakeAsync(() => {
        const testReports = [new TestReport()];

        const mockBackendService = TestBed.get(BACKEND_SERVICE);
        mockBackendService.getReports = jasmine
          .createSpy('getReports')
          .and.callFake((_buildSlug) => of({ testReports: testReports }).pipe(delay(3000)));
        mockBackendService.getReportDetails = jasmine
          .createSpy('getReportDetails')
          .and.callFake((_buildSlug, testReport) => {
            return of({ testReport })
              .pipe(delay(3000))
              .pipe(
                map(() => {
                  testReport.testSuites = [testSuiteWithStatus(TestSuiteStatus.passed)];
                })
              );
          });

        actions$ = new Observable((observer) => {
          observer.next(new StartPollingReports({ buildSlug: 'old-test-build-slug' }));

          setTimeout(() => {
            observer.next(new StartPollingReports({ buildSlug: 'new-test-build-slug' }));
          }, 2000)
        });
        let emits = [];
        const subscription = effects.$fetchReports.subscribe(({ payload, type }) => {
          emits.push({ payload, type });
        });

        tick(1000);

        expect(mockBackendService.getReports).toHaveBeenCalledTimes(1);
        expect(mockBackendService.getReports).toHaveBeenCalledWith('old-test-build-slug');
        expect(mockBackendService.getReportDetails).not.toHaveBeenCalled();
        expect(emits.length).toBe(0);

        mockBackendService.getReports.calls.reset();
        mockBackendService.getReportDetails.calls.reset();
        emits = [];
        tick(2000);

        expect(mockBackendService.getReports).toHaveBeenCalledTimes(1);
        expect(mockBackendService.getReports).toHaveBeenCalledWith('new-test-build-slug');
        expect(mockBackendService.getReportDetails).not.toHaveBeenCalled();
        expect(emits.length).toBe(0);

        mockBackendService.getReports.calls.reset();
        mockBackendService.getReportDetails.calls.reset();
        emits = [];
        tick(3000);

        expect(mockBackendService.getReports).not.toHaveBeenCalled();
        expect(mockBackendService.getReportDetails).toHaveBeenCalledTimes(1);
        expect(mockBackendService.getReportDetails).toHaveBeenCalledWith('new-test-build-slug', testReports[0]);
        expect(emits.length).toBe(0);

        mockBackendService.getReports.calls.reset();
        mockBackendService.getReportDetails.calls.reset();
        emits = [];
        tick(3000);

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
