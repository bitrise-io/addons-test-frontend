import { Action } from '@ngrx/store';

import { Performance } from 'src/app/models/performance.model';
import { TestReport } from 'src/app/models/test-report.model';
import { TestSuite } from 'src/app/models/test-suite.model';

export enum PerformanceActionTypes {
  Fetch = '[Performance] Fetch',
  Receive = '[Performance] Receive'
}

export class FetchPerformance implements Action {
  readonly type = PerformanceActionTypes.Fetch;

  constructor(public payload: { testReport: TestReport, testSuite: TestSuite}) {}
}

export class ReceivePerformance implements Action {
  readonly type = PerformanceActionTypes.Receive;

  constructor(public payload: Performance) {}
}

export type PerformanceActions = FetchPerformance | ReceivePerformance;
