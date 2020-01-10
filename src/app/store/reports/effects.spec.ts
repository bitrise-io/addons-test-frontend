import { TestBed, fakeAsync, tick, inject } from '@angular/core/testing';

import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { StoreModule, Store } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';

import { provideMockStore, MockStore } from 'src/app/mock-store/testing';
import { BACKEND_SERVICE } from 'src/app/services/backend/backend.model';
import { MockBackendService } from 'src/app/services/backend/backend.mock.service';
import { ProviderService } from 'src/app/services/provider/provider.service';
import { TestSuiteStatus, TestSuite } from 'src/app/models/test-suite.model';
import { TestReport } from 'src/app/models/test-report.model';
import { ReportActions, StartPollingReports, ReportActionTypes } from './actions';
import { ReportsReducer, TestReportState } from './reducer';
import { ReportEffects, UPDATE_INTERVAL_MS } from './effects';

describe('Report Effects', () => {
  let store: MockStore<{ testReport: TestReportState }>;
  let actions$: Observable<ReportActions>;
  let effects: ReportEffects;

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

  describe('fetchReports', () => {
    const testSuiteWithStatus = (testSuiteStatus: TestSuiteStatus) => {
      const testSuite = new TestSuite();
      testSuite.status = testSuiteStatus;

      return testSuite;
    };

    const testSuitesWithStatuses = (testSuiteStatuses: TestSuiteStatus[]) => testSuiteStatuses.map(testSuiteWithStatus);

    const testReportList = (count: Number) =>
      Array(count)
        .fill(null)
        .map(() => new TestReport());

    const createMockedBackendServiceWithSpies = ({ getReports, getReportDetails }) => {
      const mockBackendService = TestBed.get(BACKEND_SERVICE);
      mockBackendService.getReports = jasmine.createSpy('getReports').and.callFake(getReports);
      mockBackendService.getReportDetails = jasmine.createSpy('getReportDetails').and.callFake(getReportDetails);

      return mockBackendService;
    };

    describe('when there are no test reports', () => {
      it('calls getReports once, does not call getReportDetails', fakeAsync(() => {
        const mockBackendService = createMockedBackendServiceWithSpies({
          getReports: () => of({ testReports: [] }),
          getReportDetails: (_buildSlug: string, testReport: TestReport) => of({ testReport })
        });

        actions$ = of(new StartPollingReports({ buildSlug: 'test-build-slug' }));
        effects.$fetchReports.subscribe();
        tick();

        expect(mockBackendService.getReports).toHaveBeenCalledTimes(1);
        expect(mockBackendService.getReportDetails).not.toHaveBeenCalled();
      }));
    });

    describe('when there are only finished test reports', () => {
      it('calls getReports once, getReportDetails for each test report', fakeAsync(() => {
        const testReports = testReportList(2);
        const mockBackendService = createMockedBackendServiceWithSpies({
          getReports: () => of({ testReports }),
          getReportDetails: (_buildSlug: string, testReport: TestReport) => {
            testReport.testSuites = testSuitesWithStatuses([
              TestSuiteStatus.inconclusive,
              TestSuiteStatus.passed,
              TestSuiteStatus.failed,
              TestSuiteStatus.skipped
            ]);

            return of({ testReport });
          }
        });

        actions$ = of(new StartPollingReports({ buildSlug: 'test-build-slug' }));
        effects.$fetchReports.subscribe();
        tick();

        expect(mockBackendService.getReports).toHaveBeenCalledTimes(1);
        expect(mockBackendService.getReportDetails).toHaveBeenCalledTimes(2);
        expect(mockBackendService.getReportDetails).toHaveBeenCalledWith('test-build-slug', testReports[0]);
        expect(mockBackendService.getReportDetails).toHaveBeenCalledWith('test-build-slug', testReports[1]);

        mockBackendService.getReports.calls.reset();
        mockBackendService.getReportDetails.calls.reset();

        tick(UPDATE_INTERVAL_MS);

        expect(mockBackendService.getReports).not.toHaveBeenCalled();
        expect(mockBackendService.getReportDetails).not.toHaveBeenCalled();
      }));
    });

    describe('when there are some test reports which did not get test suites via getReportDetails', () => {
      it('calls getReports once, getReportDetails for each test report once, re-polls until all reports get test suites', fakeAsync(() => {
        const testReports = testReportList(1);
        let testSuitesOfTestReport: TestSuite[];
        const mockBackendService = createMockedBackendServiceWithSpies({
          getReports: () => of({ testReports }),
          getReportDetails: (_buildSlug: string, testReport: TestReport) => {
            testReport.testSuites = testSuitesOfTestReport;

            return of({ testReport });
          }
        });

        actions$ = of(new StartPollingReports({ buildSlug: 'test-build-slug' }));
        effects.$fetchReports.subscribe();
        tick();

        expect(mockBackendService.getReports).toHaveBeenCalledTimes(1);
        expect(mockBackendService.getReportDetails).toHaveBeenCalledTimes(1);
        expect(mockBackendService.getReportDetails).toHaveBeenCalledWith('test-build-slug', testReports[0]);

        mockBackendService.getReports.calls.reset();
        mockBackendService.getReportDetails.calls.reset();

        testSuitesOfTestReport = [testSuiteWithStatus(TestSuiteStatus.passed)];
        tick(UPDATE_INTERVAL_MS);

        expect(mockBackendService.getReports).not.toHaveBeenCalled();
        expect(mockBackendService.getReportDetails).toHaveBeenCalledTimes(1);
        expect(mockBackendService.getReportDetails).toHaveBeenCalledWith('test-build-slug', testReports[0]);

        mockBackendService.getReports.calls.reset();
        mockBackendService.getReportDetails.calls.reset();

        tick(UPDATE_INTERVAL_MS);

        expect(mockBackendService.getReports).not.toHaveBeenCalled();
        expect(mockBackendService.getReportDetails).not.toHaveBeenCalled();
      }));
    });

    describe('when there are some in-progress test reports', () => {
      it('calls getReports once, getReportDetails for each test report once, re-polls until all test reports finish', fakeAsync(() => {
        const testReports = testReportList(2);
        const testSuitesOfTestReports = [
          testSuitesWithStatuses([
            TestSuiteStatus.inProgress,
            TestSuiteStatus.inconclusive,
            TestSuiteStatus.passed,
            TestSuiteStatus.failed,
            TestSuiteStatus.skipped
          ]),
          testSuitesWithStatuses([
            TestSuiteStatus.inconclusive,
            TestSuiteStatus.passed,
            TestSuiteStatus.failed,
            TestSuiteStatus.skipped
          ])
        ];
        const mockBackendService = createMockedBackendServiceWithSpies({
          getReports: () => of({ testReports }),
          getReportDetails: (_buildSlug: string, testReport: TestReport) => {
            testReport.testSuites = testSuitesOfTestReports[testReports.indexOf(testReport)];

            return of({ testReport });
          }
        });

        actions$ = of(new StartPollingReports({ buildSlug: 'test-build-slug' }));
        effects.$fetchReports.subscribe();
        tick();

        expect(mockBackendService.getReports).toHaveBeenCalledTimes(1);
        expect(mockBackendService.getReportDetails).toHaveBeenCalledTimes(2);
        expect(mockBackendService.getReportDetails).toHaveBeenCalledWith('test-build-slug', testReports[0]);
        expect(mockBackendService.getReportDetails).toHaveBeenCalledWith('test-build-slug', testReports[1]);

        mockBackendService.getReports.calls.reset();
        mockBackendService.getReportDetails.calls.reset();

        testSuitesOfTestReports[0][0].status = TestSuiteStatus.passed;
        tick(UPDATE_INTERVAL_MS);

        expect(mockBackendService.getReports).not.toHaveBeenCalled();
        expect(mockBackendService.getReportDetails).toHaveBeenCalledTimes(2);
        expect(mockBackendService.getReportDetails).toHaveBeenCalledWith('test-build-slug', testReports[0]);
        expect(mockBackendService.getReportDetails).toHaveBeenCalledWith('test-build-slug', testReports[1]);

        mockBackendService.getReports.calls.reset();
        mockBackendService.getReportDetails.calls.reset();

        tick(UPDATE_INTERVAL_MS);

        expect(mockBackendService.getReports).not.toHaveBeenCalled();
        expect(mockBackendService.getReportDetails).not.toHaveBeenCalled();
      }));
    });

    describe('when getReportDetails takes a significant amount of time', () => {
      it('only starts period interval countdown after getReportDetails has finished', fakeAsync(() => {
        const testReports = testReportList(1);
        const testSuites = [testSuiteWithStatus(TestSuiteStatus.inProgress)];
        const mockBackendService = createMockedBackendServiceWithSpies({
          getReports: () => of({ testReports }),
          getReportDetails: (_buildSlug: string, testReport: TestReport) =>
            of({ testReport })
              .pipe(delay(2000))
              .pipe(
                map(() => {
                  testReport.testSuites = testSuites;

                  return { testReport };
                })
              )
        });

        actions$ = of(new StartPollingReports({ buildSlug: 'test-build-slug' }));
        effects.$fetchReports.subscribe();
        tick();

        expect(mockBackendService.getReports).toHaveBeenCalledTimes(1);
        expect(mockBackendService.getReportDetails).toHaveBeenCalledTimes(1);
        expect(mockBackendService.getReportDetails).toHaveBeenCalledWith('test-build-slug', testReports[0]);

        mockBackendService.getReportDetails.calls.reset();

        tick(1999 + UPDATE_INTERVAL_MS);

        expect(mockBackendService.getReportDetails).not.toHaveBeenCalled();

        mockBackendService.getReportDetails.calls.reset();

        testSuites[0].status = TestSuiteStatus.passed;
        tick(1);

        expect(mockBackendService.getReportDetails).toHaveBeenCalledTimes(1);
        expect(mockBackendService.getReportDetails).toHaveBeenCalledWith('test-build-slug', testReports[0]);

        tick(2000);
      }));
    });

    describe('when filter is set to a state', () => {
      beforeEach(inject([Store], (mockStore: MockStore<{ testReport: TestReportState }>) => {
        store = mockStore;
      }));

      it('emits all received reports, emits filter state', fakeAsync(() => {
        const testReports = testReportList(2);
        const testSuitesOfTestReports = [
          [testSuiteWithStatus(TestSuiteStatus.failed)],
          [testSuiteWithStatus(TestSuiteStatus.passed)]
        ];

        store.setState({
          testReport: {
            testReports: undefined,
            filteredReports: undefined,
            filter: TestSuiteStatus.failed
          }
        });

        createMockedBackendServiceWithSpies({
          getReports: () => of({ testReports }),
          getReportDetails: (_buildSlug: string, testReport: TestReport) => {
            testReport.testSuites = testSuitesOfTestReports[testReports.indexOf(testReport)];

            return of({ testReport });
          }
        });

        actions$ = of(new StartPollingReports({ buildSlug: 'test-build-slug' }));
        const emits = [];
        effects.$fetchReports.subscribe(({ payload, type }) => {
          emits.push({ payload, type });
        });

        tick();

        expect(emits).toEqual([
          { type: ReportActionTypes.Receive, payload: { testReports } },
          { type: ReportActionTypes.Filter, payload: { filter: TestSuiteStatus.failed } }
        ]);
      }));
    });

    describe('when filter is set to a state, but changes during getReports', () => {
      beforeEach(inject([Store], (mockStore: MockStore<{ testReport: TestReportState }>) => {
        store = mockStore;
      }));

      it('emits all received reports, emits new filter state, does not re-call getReports', fakeAsync(() => {
        const testReports = testReportList(2);

        store.setState({
          testReport: {
            testReports: undefined,
            filteredReports: undefined,
            filter: TestSuiteStatus.failed
          }
        });

        const mockBackendService = createMockedBackendServiceWithSpies({
          getReports: () => of({ testReports }).pipe(delay(1000)),
          getReportDetails: (_buildSlug: string, testReport: TestReport) => {
            testReport.testSuites = [testSuiteWithStatus(TestSuiteStatus.passed)];

            return of({ testReport });
          }
        });

        actions$ = of(new StartPollingReports({ buildSlug: 'test-build-slug' }));
        let emits = [];
        effects.$fetchReports.subscribe(({ payload, type }) => {
          emits.push({ payload, type });
        });

        tick();

        expect(mockBackendService.getReports).toHaveBeenCalledTimes(1);
        expect(mockBackendService.getReportDetails).not.toHaveBeenCalled();
        expect(emits).toEqual([]);

        mockBackendService.getReports.calls.reset();
        mockBackendService.getReportDetails.calls.reset();
        emits = [];

        store.setState({
          testReport: {
            testReports,
            filteredReports: testReports,
            filter: TestSuiteStatus.passed
          }
        });

        tick(1000);

        expect(mockBackendService.getReports).not.toHaveBeenCalled();
        expect(mockBackendService.getReportDetails).toHaveBeenCalledTimes(2);
        expect(mockBackendService.getReportDetails).toHaveBeenCalledWith('test-build-slug', testReports[0]);
        expect(mockBackendService.getReportDetails).toHaveBeenCalledWith('test-build-slug', testReports[1]);
        expect(emits).toEqual([
          { type: ReportActionTypes.Receive, payload: { testReports } },
          { type: ReportActionTypes.Filter, payload: { filter: TestSuiteStatus.passed } }
        ]);
      }));
    });

    describe('when filter is set to a state, but changes during the period interval', () => {
      beforeEach(inject([Store], (mockStore: MockStore<{ testReport: TestReportState }>) => {
        store = mockStore;
      }));

      it('emits all reports, old filter state, new filter state after re-poll, does not re-call requests', fakeAsync(() => {
        const testReports = testReportList(2);
        const testSuitesOfTestReports = [
          [testSuiteWithStatus(TestSuiteStatus.inProgress)],
          [testSuiteWithStatus(TestSuiteStatus.passed)]
        ];

        store.setState({
          testReport: {
            testReports: undefined,
            filteredReports: undefined,
            filter: TestSuiteStatus.failed
          }
        });

        const mockBackendService = createMockedBackendServiceWithSpies({
          getReports: () => of({ testReports }),
          getReportDetails: (_buildSlug: string, testReport: TestReport) => {
            testReport.testSuites = testSuitesOfTestReports[testReports.indexOf(testReport)];

            return of({ testReport });
          }
        });

        actions$ = of(new StartPollingReports({ buildSlug: 'test-build-slug' }));
        let emits = [];
        effects.$fetchReports.subscribe(({ payload, type }) => {
          emits.push({ payload, type });
        });
        tick();

        expect(mockBackendService.getReports).toHaveBeenCalledTimes(1);
        expect(mockBackendService.getReportDetails).toHaveBeenCalledTimes(2);
        expect(mockBackendService.getReportDetails).toHaveBeenCalledWith('test-build-slug', testReports[0]);
        expect(mockBackendService.getReportDetails).toHaveBeenCalledWith('test-build-slug', testReports[1]);

        expect(emits).toEqual([
          { type: ReportActionTypes.Receive, payload: { testReports } },
          { type: ReportActionTypes.Filter, payload: { filter: TestSuiteStatus.failed } }
        ]);

        mockBackendService.getReports.calls.reset();
        mockBackendService.getReportDetails.calls.reset();
        emits = [];

        testSuitesOfTestReports[0][0].status = TestSuiteStatus.passed;
        store.setState({
          testReport: {
            testReports,
            filteredReports: testReports,
            filter: TestSuiteStatus.passed
          }
        });

        tick(UPDATE_INTERVAL_MS);

        expect(mockBackendService.getReports).not.toHaveBeenCalled();
        expect(mockBackendService.getReportDetails).toHaveBeenCalledTimes(2);
        expect(mockBackendService.getReportDetails).toHaveBeenCalledWith('test-build-slug', testReports[0]);
        expect(mockBackendService.getReportDetails).toHaveBeenCalledWith('test-build-slug', testReports[1]);

        expect(emits).toEqual([
          { type: ReportActionTypes.Receive, payload: { testReports } },
          { type: ReportActionTypes.Filter, payload: { filter: TestSuiteStatus.passed } }
        ]);
      }));
    });

    describe('when filter is set to a state, but changes during getReportDetails', () => {
      beforeEach(inject([Store], (mockStore: MockStore<{ testReport: TestReportState }>) => {
        store = mockStore;
      }));

      it('emits all received reports, emits new filter state, does not re-call getReports & getReportDetails', fakeAsync(() => {
        const testReports = testReportList(2);

        store.setState({
          testReport: {
            testReports: undefined,
            filteredReports: undefined,
            filter: TestSuiteStatus.failed
          }
        });

        const mockBackendService = createMockedBackendServiceWithSpies({
          getReports: () => of({ testReports }),
          getReportDetails: (_buildSlug: string, testReport: TestReport) => {
            return of({ testReport })
              .pipe(delay(1000))
              .pipe(
                map(() => {
                  testReport.testSuites = [testSuiteWithStatus(TestSuiteStatus.passed)];
                })
              );
          }
        });

        actions$ = of(new StartPollingReports({ buildSlug: 'test-build-slug' }));
        let emits = [];
        effects.$fetchReports.subscribe(({ payload, type }) => {
          emits.push({ payload, type });
        });
        tick();

        expect(mockBackendService.getReports).toHaveBeenCalledTimes(1);
        expect(mockBackendService.getReportDetails).toHaveBeenCalledTimes(2);
        expect(mockBackendService.getReportDetails).toHaveBeenCalledWith('test-build-slug', testReports[0]);
        expect(mockBackendService.getReportDetails).toHaveBeenCalledWith('test-build-slug', testReports[1]);
        expect(emits).toEqual([]);

        mockBackendService.getReports.calls.reset();
        mockBackendService.getReportDetails.calls.reset();
        emits = [];

        store.setState({
          testReport: {
            testReports,
            filteredReports: testReports,
            filter: TestSuiteStatus.passed
          }
        });

        tick(1000);

        expect(mockBackendService.getReports).not.toHaveBeenCalled();
        expect(mockBackendService.getReportDetails).not.toHaveBeenCalled();
        expect(emits).toEqual([
          { type: ReportActionTypes.Receive, payload: { testReports } },
          { type: ReportActionTypes.Filter, payload: { filter: TestSuiteStatus.passed } }
        ]);
      }));
    });

    describe('when a new fetch report starts before the previous is finished', () => {
      it('emits the result of the new fetch, does not emit the result of the old fetch', fakeAsync(() => {
        const testReports = [new TestReport()];

        const mockBackendService = createMockedBackendServiceWithSpies({
          getReports: () => of({ testReports }).pipe(delay(2000)),
          getReportDetails: (_buildSlug: string, testReport: TestReport) => {
            testReport.testSuites = [testSuiteWithStatus(TestSuiteStatus.passed)];

            return of({ testReport });
          }
        });

        actions$ = new Observable((observer) => {
          observer.next(new StartPollingReports({ buildSlug: 'old-test-build-slug' }));

          setTimeout(() => {
            observer.next(new StartPollingReports({ buildSlug: 'new-test-build-slug' }));
          }, 1000);
        });
        const emits = [];
        effects.$fetchReports.subscribe(({ payload, type }) => {
          emits.push({ payload, type });
        });
        tick();

        expect(mockBackendService.getReports).toHaveBeenCalledTimes(1);
        expect(mockBackendService.getReports).toHaveBeenCalledWith('old-test-build-slug');
        expect(mockBackendService.getReportDetails).not.toHaveBeenCalled();
        expect(emits).toEqual([]);

        mockBackendService.getReports.calls.reset();
        mockBackendService.getReportDetails.calls.reset();
        tick(1000);

        expect(mockBackendService.getReports).toHaveBeenCalledTimes(1);
        expect(mockBackendService.getReports).toHaveBeenCalledWith('new-test-build-slug');
        expect(mockBackendService.getReportDetails).not.toHaveBeenCalled();
        expect(emits).toEqual([]);

        mockBackendService.getReportDetails.calls.reset();

        tick(1000);
        expect(mockBackendService.getReportDetails).not.toHaveBeenCalled();
        expect(emits).toEqual([]);

        tick(1000);
        expect(mockBackendService.getReportDetails).toHaveBeenCalledTimes(1);
        expect(mockBackendService.getReportDetails).toHaveBeenCalledWith('new-test-build-slug', testReports[0]);
        expect(emits).toEqual([
          { type: ReportActionTypes.Receive, payload: { testReports } },
          { type: ReportActionTypes.Filter, payload: { filter: TestSuiteStatus.passed } }
        ]);
      }));
    });
  });
});
