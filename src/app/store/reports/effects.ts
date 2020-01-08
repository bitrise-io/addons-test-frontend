import { Injectable, Inject } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, of, Observer } from 'rxjs';
import { switchMap, withLatestFrom, take } from 'rxjs/operators';

import {
  ReportActionTypes,
  ReceiveReports,
  ReportActions,
  FilterReports,
  ReceiveFilteredReports,
  StartPollingReports
} from './actions';
import { BackendService, BACKEND_SERVICE, TestReportsResult } from 'src/app/services/backend/backend.model';
import { TestReportState } from './reducer';
import { filterReports } from './filter-reports';
import { TestSuite, TestSuiteStatus } from 'src/app/models/test-suite.model';
import { TestReport } from 'src/app/models/test-report.model';

const UPDATE_INTERVAL_MS = 5000;

@Injectable()
export class ReportEffects {
  latestFetchReportsObservable: Observable<ReportActions>;

  @Effect()
  $fetchReports: Observable<ReportActions> = this.actions$.pipe(
    ofType(ReportActionTypes.StartPolling),
    switchMap((action: StartPollingReports) => {
      const fetchReportsObservable = (this.latestFetchReportsObservable = new Observable(
        (observer: Observer<ReportActions>) => {
          this.backendService
            .getReports(action.payload.buildSlug)
            .toPromise()
            .then(({ testReports }: TestReportsResult) => {
              const periodicallyGetReportDetailsAndEmitActionsUntilFinished = () => {
                if (fetchReportsObservable !== this.latestFetchReportsObservable) {
                  return;
                }

                Promise.all(
                  testReports.map((testReport: TestReport) =>
                    this.backendService.getReportDetails(action.payload.buildSlug, testReport).toPromise()
                  )
                ).then(() => {
                  this.store$
                    .pipe(take(1))
                    .toPromise()
                    .then(({ testReport: { filter } }) => {
                      if (fetchReportsObservable !== this.latestFetchReportsObservable) {
                        return;
                      }

                      observer.next(new ReceiveReports({ testReports }));
                      observer.next(new FilterReports({ filter }));

                      if (
                        testReports.some(
                          (testReport: TestReport) =>
                            !testReport.testSuites ||
                            testReport.testSuites.find(
                              (testSuite: TestSuite) => testSuite.status === TestSuiteStatus.inProgress
                            ) !== undefined
                        )
                      ) {
                        setTimeout(periodicallyGetReportDetailsAndEmitActionsUntilFinished, UPDATE_INTERVAL_MS);
                      }
                    });
                });
              };

              periodicallyGetReportDetailsAndEmitActionsUntilFinished();
            });
        }
      ));

      return this.latestFetchReportsObservable;
    })
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
