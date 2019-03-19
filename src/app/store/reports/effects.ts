import { Injectable, Inject } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, timer, of } from 'rxjs';
import { switchMap, map, withLatestFrom, merge } from 'rxjs/operators';

import { ReportActionTypes, ReceiveReports, ReportActions, FilterReports, ReceiveFilteredReports } from './actions';
import { BackendService, BACKEND_SERVICE, TestReportsResult } from 'src/app/services/backend/backend.model';
import { TestReportState } from './reducer';
import filterReports from './filter-reports';

@Injectable()
export class ReportEffects {
  @Effect()
  $fetchReports: Observable<ReportActions> = this.actions$.pipe(
    ofType(ReportActionTypes.StartPolling),
    switchMap(() =>
      timer(0, 4000).pipe(
        withLatestFrom(this.store$),
        switchMap(([, { testReport: { filter } }]: [any, { testReport: TestReportState }]) =>
          this.backendService.getReports().pipe(
            map((result: TestReportsResult) => new ReceiveReports(result)),
            merge(of(new FilterReports({ filter })))
          )
        )
      )
    )
  );

  @Effect()
  $filterReports: Observable<ReportActions> = this.actions$.pipe(
    ofType(ReportActionTypes.Filter),
    withLatestFrom(this.store$),
    map(
      ([
        {
          payload: { filter }
        },
        {
          testReport: { testReports }
        }
      ]: [FilterReports, { testReport: TestReportState }]) =>
        new ReceiveFilteredReports({ testReports: filterReports(testReports, filter) })
    )
  );

  constructor(
    private actions$: Actions,
    private store$: Store<{ testReport: TestReportState }>,
    @Inject(BACKEND_SERVICE) private backendService: BackendService
  ) {}
}
