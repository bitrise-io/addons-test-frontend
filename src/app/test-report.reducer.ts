import { Action } from '@ngrx/store';
import { TestReport, TestReportResponse } from './test-report.model';
import { TestReportAction } from './test-report.actions';
import * as MOCKED_DATA from './mocked-data.json';

export const initialState: TestReport[] = undefined;

export function testReportReducer(state = initialState, action: Action) {
  switch (action.type) {
    case TestReportAction.load:
      return MOCKED_DATA['test_reports'].map((testReportResponse: TestReportResponse) =>
        new TestReport().deserialize(testReportResponse)
      );
    default:
      return state;
  }
}
