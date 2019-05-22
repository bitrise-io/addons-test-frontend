import { Injectable, Inject } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

import { AppActionTypes, AppActions, ReceiveApp, FetchApp } from './actions';
import { BackendService, BACKEND_SERVICE } from 'src/app/services/backend/backend.model';

@Injectable()
export class AppEffects {
  @Effect()
  $fetchReports: Observable<AppActions> = this.actions$.pipe(
    ofType(AppActionTypes.Fetch),
    switchMap(() => this.backendService.getApp().pipe(map((result) => new ReceiveApp(result))))
  );

  constructor(private actions$: Actions, @Inject(BACKEND_SERVICE) private backendService: BackendService) {}
}
