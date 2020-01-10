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
import { TestSuiteStatus } from 'src/app/models/test-suite.model';
import { TestReport } from 'src/app/models/test-report.model';

export const UPDATE_INTERVAL_MS = 5000;

@Injectable()
export class ReportEffects {
  latestFetchReportsObservable: Observable<ReportActions>;

  @Effect()
  $fetchReports: Observable<ReportActions> = this.actions$.pipe(
    ofType(ReportActionTypes.StartPolling),
    switchMap((action: StartPollingReports) => {
      this.latestFetchReportsObservable = this.pollReports(action);

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

  pollReports(action: StartPollingReports) {
    const fetchReportsObservable = new Observable((observer: Observer<ReportActions>) => {
      this.backendService
        .getReports(action.payload.buildSlug)
        .toPromise()
        .then(({ testReports }: TestReportsResult) => {
          const periodicallyGetReportDetails = async () => {
            const shouldAbortPolling = () => fetchReportsObservable !== this.latestFetchReportsObservable;
            if (shouldAbortPolling()) {
              return;
            }

            await Promise.all(
              testReports.map((testReport: TestReport) =>
                this.backendService.getReportDetails(action.payload.buildSlug, testReport).toPromise()
              )
            );

            const {
              testReport: { filter }
            } = await this.store$.pipe(take(1)).toPromise();

            if (shouldAbortPolling()) {
              return;
            }

            observer.next(new ReceiveReports({ testReports }));
            observer.next(new FilterReports({ filter }));

            const isAnyReportInProgress = testReports.some(
              ({ testSuites }) => !testSuites || testSuites.some(({ status }) => status === TestSuiteStatus.inProgress)
            );

            if (isAnyReportInProgress) {
              setTimeout(periodicallyGetReportDetails, UPDATE_INTERVAL_MS);
            }
          };

          periodicallyGetReportDetails();
        });
    });
    return fetchReportsObservable;
  }

  constructor(
    private actions$: Actions,
    private store$: Store<{ testReport: TestReportState }>,
    @Inject(BACKEND_SERVICE) private backendService: BackendService
  ) {}
}
