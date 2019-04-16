import { Action } from '@ngrx/store';

import { LogResult } from 'src/app/services/backend/backend.model';
import { TestReport } from 'src/app/models/test-report.model';

export enum LogActionTypes {
  Fetch = '[Log] Load',
  Receive = '[Log] Receive'
}

export class FetchLog implements Action {
  readonly type = LogActionTypes.Fetch;

  constructor(public payload: TestReport) {}
}

export class ReceiveLog implements Action {
  readonly type = LogActionTypes.Receive;

  constructor(public payload: LogResult) {}
}

export type LogActions = FetchLog | ReceiveLog;
