import { Action } from '@ngrx/store';

import { LogResult } from 'src/app/services/backend/backend.model';

export enum LogActionTypes {
  Fetch = '[Log] Load',
  Receive = '[Log] Receive'
}

export class FetchLog implements Action {
  readonly type = LogActionTypes.Fetch;
}

export class ReceiveLog implements Action {
  readonly type = LogActionTypes.Receive;

  constructor(public payload: LogResult) {}
}

export type LogActions = FetchLog | ReceiveLog;
