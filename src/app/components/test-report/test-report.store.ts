import { Action } from '@ngrx/store';
import { TestReport, TestReportResponse } from '../../models/test-report.model';
import * as MOCKED_DATA from '../../mocked-data.json';

enum TestReportStoreAction {
  load = 'load'
}

export class TestReportStoreActionLoad implements Action {
  readonly type = TestReportStoreAction.load;
}

const initialState: TestReport[] = undefined;

export function testReportStoreReducer(state = initialState, action: Action) {
  switch (action.type) {
    case TestReportStoreAction.load:
      return MOCKED_DATA['test_reports'].map((testReportResponse: TestReportResponse) =>
        new TestReport().deserialize(testReportResponse)
      );
    default:
      return state;
  }
}
