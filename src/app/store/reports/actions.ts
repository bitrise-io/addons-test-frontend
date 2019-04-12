import { Action } from '@ngrx/store';

import { TestSuiteStatus } from 'src/app/models/test-suite.model';
import { TestReportsResult } from 'src/app/services/backend/backend.model';

export enum ReportActionTypes {
  FetchList = '[Reports] FetchList',
  ReceiveList = '[Reports] ReceiveList',
  FilterList = '[Reports] FilterList',
  ReceiveFilteredList = '[Reports] ReceiveFilteredList'
}

export class FetchReportList implements Action {
  readonly type = ReportActionTypes.FetchList;
}

export class ReceiveReportList implements Action {
  readonly type = ReportActionTypes.ReceiveList;

  constructor(public payload: TestReportsResult) {}
}

export class ReceiveFilteredReportList implements Action {
  readonly type = ReportActionTypes.ReceiveFilteredList;

  constructor(public payload: TestReportsResult) {}
}

export class FilterReportList implements Action {
  readonly type = ReportActionTypes.FilterList;

  constructor(public payload: { filter: TestSuiteStatus }) {}
}

export type ReportActions = FetchReportList | ReceiveReportList | FilterReportList | ReceiveFilteredReportList;
