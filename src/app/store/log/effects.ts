import { Injectable, Inject } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

import { LogActionTypes, LogActions, ReceiveLog } from './actions';
import { BackendService, BACKEND_SERVICE } from 'src/app/services/backend/backend.model';

@Injectable()
export class LogEffects {
  @Effect()
  $fetchReports: Observable<LogActions> = this.actions$.pipe(
    ofType(LogActionTypes.Fetch),
    switchMap(() => this.backendService.getLog().pipe(map(result => new ReceiveLog(result))))
  );

  constructor(private actions$: Actions, @Inject(BACKEND_SERVICE) private backendService: BackendService) {}
}
