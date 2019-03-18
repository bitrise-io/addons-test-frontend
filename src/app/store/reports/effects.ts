import { Injectable, Inject } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, timer } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

import { ReportActionTypes, ReceiveReports, ReportActions } from './actions';
import { BackendService, BACKEND_SERVICE } from 'src/app/services/backend/backend.model';

@Injectable()
export class ReportEffects {
  @Effect()
  $fetchReports: Observable<ReportActions> = this.actions$.pipe(
    ofType(ReportActionTypes.Fetch),
    switchMap(() =>
      timer(0, 5000).pipe(
        map(() => {
          this.backendService.getCharacter(1);

          return new ReceiveReports(null);
        })
      )
    )
  );

  constructor(private actions$: Actions, @Inject(BACKEND_SERVICE) private backendService: BackendService) {}
}
