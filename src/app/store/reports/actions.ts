import { Action } from '@ngrx/store';

import { TestSuiteStatus } from 'src/app/models/test-suite.model';
import { TestReportsResult } from 'src/app/services/backend/backend.model';

export enum ReportActionTypes {
  StartPolling = '[Reports] StartPolling',
  Receive = '[Reports] Receive',
  Filter = '[Reports] Filter',
  ReceiveFiltered = '[Reports] ReceiveFiltered'
}

export class StartPollingReports implements Action {
  readonly type = ReportActionTypes.StartPolling;

  constructor(public payload: { buildSlug: string }) {}
}

export class ReceiveReports implements Action {
  readonly type = ReportActionTypes.Receive;

  constructor(public payload: TestReportsResult) {}
}

export class ReceiveFilteredReports implements Action {
  readonly type = ReportActionTypes.ReceiveFiltered;

  constructor(public payload: TestReportsResult) {}
}

export class FilterReports implements Action {
  readonly type = ReportActionTypes.Filter;

  constructor(public payload: { filter: TestSuiteStatus }) {}
}

export type ReportActions = StartPollingReports | ReceiveReports | FilterReports | ReceiveFilteredReports;
