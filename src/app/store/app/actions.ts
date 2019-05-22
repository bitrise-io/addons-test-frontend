import { Action } from '@ngrx/store';

import { AppResult } from 'src/app/services/backend/backend.model';

export enum AppActionTypes {
  Fetch = '[App] Load',
  Receive = '[App] Receive'
}

export class FetchApp implements Action {
  readonly type = AppActionTypes.Fetch;
}

export class ReceiveApp implements Action {
  readonly type = AppActionTypes.Receive;

  constructor(public payload: AppResult) {}
}

export type AppActions = FetchApp | ReceiveApp;
