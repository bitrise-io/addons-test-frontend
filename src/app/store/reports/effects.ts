import { Injectable, Inject } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, timer, forkJoin, of } from 'rxjs';
import { switchMap, withLatestFrom, takeWhile, mergeMap } from 'rxjs/operators';

import { ReportActionTypes, ReceiveReports, ReportActions, FilterReports, ReceiveFilteredReports, StartPollingReports } from './actions';
import { BackendService, BACKEND_SERVICE, TestReportsResult } from 'src/app/services/backend/backend.model';
import { TestReportState } from './reducer';
import filterReports from './filter-reports';
import { TestSuite, TestSuiteStatus } from 'src/app/models/test-suite.model';
import { TestReport } from 'src/app/models/test-report.model';

const UPDATE_INTERVAL_MS = 5000;

@Injectable()
export class ReportEffects {
  @Effect()
  $fetchReports: Observable<ReportActions> = this.actions$.pipe(
    ofType(ReportActionTypes.StartPolling),
    mergeMap((action: StartPollingReports) =>
      this.backendService.getReports(action.payload.buildSlug).pipe(
        switchMap(({ testReports }: TestReportsResult) =>
          timer(0, UPDATE_INTERVAL_MS).pipe(
            takeWhile(
              () =>
                testReports.every((testReport: TestReport) => !testReport.testSuites) ||
                testReports.some(
                  (testReport: TestReport) =>
                    testReport.testSuites &&
                    testReport.testSuites.find(
                      (testSuite: TestSuite) => testSuite.status === TestSuiteStatus.inProgress
                    ) !== undefined
                )
            ),
            withLatestFrom(this.store$),
            switchMap(([_, testReportState]: [any, { testReport: TestReportState }]) => {
              const { testReport: { filter } } = testReportState; // prettier-ignore

              return forkJoin(
                ...testReports.map((loadedTestReport) => this.backendService.getReportDetails(action.payload.buildSlug, loadedTestReport))
              ).pipe(mergeMap(() => [new ReceiveReports({ testReports: testReports }), new FilterReports({ filter })]));
            })
          )
        )
      )
    )
  );

  @Effect()
  $filterReports: Observable<ReportActions> = this.actions$.pipe(
    ofType(ReportActionTypes.Filter),
    withLatestFrom(this.store$),
    switchMap(([filterReportsActions, testReportState]: [FilterReports, { testReport: TestReportState }]) => {
      const { payload: { filter } } = filterReportsActions; // prettier-ignore
      const { testReport: { testReports } } = testReportState; // prettier-ignore

      return of(new ReceiveFilteredReports({ testReports: filterReports(testReports, filter) }));
    })
  );

  constructor(
    private actions$: Actions,
    private store$: Store<{ testReport: TestReportState }>,
    @Inject(BACKEND_SERVICE) private backendService: BackendService
  ) {}
}
