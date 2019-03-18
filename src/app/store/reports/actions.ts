import { Action } from '@ngrx/store';

import { TestSuiteStatus } from 'src/app/models/test-suite.model';
import { TestReportResponse } from 'src/app/models/test-report.model';

export enum ReportActionTypes {
  Fetch = '[Reports] Fetch',
  Receive = '[Reports] Receive',
  Filter = '[Reports] Filter'
}

export class FetchReports implements Action {
  readonly type = ReportActionTypes.Fetch;
}

export class ReceiveReports implements Action {
  readonly type = ReportActionTypes.Receive;

  constructor(public response: TestReportResponse) {}
}

export class FilterReports implements Action {
  readonly type = ReportActionTypes.Filter;

  constructor(public filter: TestSuiteStatus) {}
}

export type ReportActions = FetchReports | ReceiveReports | FilterReports;
