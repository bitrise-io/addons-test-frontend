import { Action } from '@ngrx/store';

export enum TestReportAction {
  load = 'load'
}

export class TestReportActionLoad implements Action {
  readonly type = TestReportAction.load;
}
