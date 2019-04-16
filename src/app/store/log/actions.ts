import { Action } from '@ngrx/store';

import { LogResult } from 'src/app/services/backend/backend.model';
import { TestSuite } from 'src/app/models/test-suite.model';

export enum LogActionTypes {
  Fetch = '[Log] Load',
  Receive = '[Log] Receive'
}

export class FetchLog implements Action {
  readonly type = LogActionTypes.Fetch;

  constructor(public payload: TestSuite) {}
}

export class ReceiveLog implements Action {
  readonly type = LogActionTypes.Receive;

  constructor(public payload: LogResult) {}
}

export type LogActions = FetchLog | ReceiveLog;
