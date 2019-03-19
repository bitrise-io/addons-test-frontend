import { Action } from '@ngrx/store';

import { Performance } from 'src/app/models/performance.model';

export enum PerformanceActionTypes {
  Fetch = '[Performance] Fetch',
  Receive = '[Performance] Receive'
}

export class FetchPerformance implements Action {
  readonly type = PerformanceActionTypes.Fetch;
}

export class ReceivePerformance implements Action {
  readonly type = PerformanceActionTypes.Receive;

  constructor(public payload: Performance) {}
}

export type PerformanceActions = FetchPerformance | ReceivePerformance;
