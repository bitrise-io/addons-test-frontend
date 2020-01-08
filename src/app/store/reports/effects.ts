import { Injectable, Inject } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
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
  @Effect()
  $fetchReports: Observable<ReportActions> = this.actions$.pipe(
    ofType(ReportActionTypes.StartPolling),
    switchMap((action: StartPollingReports) => {
      return new Observable((subscriber) => {
        this.backendService
          .getReports(action.payload.buildSlug)
          .toPromise()
          .then(({ testReports }: TestReportsResult) => {
            const periodicallyGetReportDetailsAndEmitStateUntilFinished = () => {
              const getReportDetailsPromises = testReports.map((testReport: TestReport) => {
                return this.backendService.getReportDetails(action.payload.buildSlug, testReport).toPromise();
              });

              Promise.all(getReportDetailsPromises).then(() => {
                this.store$
                  .pipe(take(1))
                  .toPromise()
                  .then(({ testReport: { filter } }) => {
                    subscriber.next(new ReceiveReports({ testReports: testReports }));
                    subscriber.next(new FilterReports({ filter }));

                    if (
                      testReports.some(
                        (testReport: TestReport) =>
                          !testReport.testSuites ||
                          testReport.testSuites.find(
                            (testSuite: TestSuite) => testSuite.status === TestSuiteStatus.inProgress
                          ) !== undefined
                      )
                    ) {
                      setTimeout(() => {
                        periodicallyGetReportDetailsAndEmitStateUntilFinished();
                      }, UPDATE_INTERVAL_MS);
                    }
                  });
              });
            };

            periodicallyGetReportDetailsAndEmitStateUntilFinished();
          });
      });
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
