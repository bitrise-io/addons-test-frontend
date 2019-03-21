import { Injectable, Inject } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, timer, of } from 'rxjs';
import { switchMap, map, withLatestFrom, merge } from 'rxjs/operators';

import { ReportActionTypes, ReceiveReports, ReportActions, FilterReports, ReceiveFilteredReports } from './actions';
import { BackendService, BACKEND_SERVICE, TestReportsResult } from 'src/app/services/backend/backend.model';
import { TestReportState } from './reducer';
import filterReports from './filter-reports';

const UPDATE_INTERVAL_MS = 5000;

@Injectable()
export class ReportEffects {
  @Effect()
  $fetchReports: Observable<ReportActions> = this.actions$.pipe(
    ofType(ReportActionTypes.StartPolling),
    switchMap(() =>
      timer(0, UPDATE_INTERVAL_MS).pipe(
        withLatestFrom(this.store$),
        switchMap(([_, testReportState]: [any, { testReport: TestReportState }]) => {
          const { testReport: { filter } } = testReportState; // prettier-ignore

          return this.backendService.getReports().pipe(
            map((result: TestReportsResult) => new ReceiveReports(result)),
            merge(of(new FilterReports({ filter })))
          );
        })
      )
    )
  );

  @Effect()
  $filterReports: Observable<ReportActions> = this.actions$.pipe(
    ofType(ReportActionTypes.Filter),
    withLatestFrom(this.store$),
    map(([filterReportsActions, testReportState]: [FilterReports, { testReport: TestReportState }]) => {
      const { payload: { filter } } = filterReportsActions; // prettier-ignore
      const { testReport: { testReports } } = testReportState; // prettier-ignore

      return new ReceiveFilteredReports({ testReports: filterReports(testReports, filter) });
    })
  );

  constructor(
    private actions$: Actions,
    private store$: Store<{ testReport: TestReportState }>,
    @Inject(BACKEND_SERVICE) private backendService: BackendService
  ) {}
}
