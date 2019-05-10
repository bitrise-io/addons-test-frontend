import { Injectable, Inject } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, of, forkJoin } from 'rxjs';
import { switchMap, withLatestFrom, mergeMap } from 'rxjs/operators';

import { ReportActionTypes, ReceiveReports, ReportActions, FilterReports, ReceiveFilteredReports } from './actions';
import {
  BackendService,
  BACKEND_SERVICE,
  TestReportsResult,
  TestReportResult
} from 'src/app/services/backend/backend.model';
import { TestReportState } from './reducer';
import filterReports from './filter-reports';

@Injectable()
export class ReportEffects {
  @Effect()
  $fetchReports: Observable<ReportActions> = this.actions$.pipe(
    ofType(ReportActionTypes.Fetch),
    withLatestFrom(this.store$),
    switchMap(([_, testReportState]: [any, { testReport: TestReportState }]) => {
      const { testReport: { filter } } = testReportState; // prettier-ignore

      return this.backendService.getReports().pipe(
        mergeMap((result: TestReportsResult) =>
          forkJoin(...result.testReports.map((testReport) => this.backendService.getReportDetails(testReport)))
        ),
        mergeMap((results: TestReportResult[]) => [
          new ReceiveReports({ testReports: results.map((result: TestReportResult) => result.testReport) }),
          new FilterReports({ filter })
        ])
      );
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
