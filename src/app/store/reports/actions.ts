import { Action } from '@ngrx/store';

import { TestSuiteStatus } from 'src/app/models/test-suite.model';
import { TestReportsResult } from 'src/app/services/backend/backend.model';

export enum ReportActionTypes {
  Fetch = '[Reports] Fetch',
  Receive = '[Reports] Receive',
  Filter = '[Reports] Filter',
  ReceiveFiltered = '[Reports] ReceiveFiltered'
}

export class FetchReports implements Action {
  readonly type = ReportActionTypes.Fetch;
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

export type ReportActions = FetchReports | ReceiveReports | FilterReports | ReceiveFilteredReports;
