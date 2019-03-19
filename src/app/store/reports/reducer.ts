import { TestReport } from 'src/app/models/test-report.model';
import { TestSuiteStatus } from 'src/app/models/test-suite.model';
import { ReportActionTypes, FilterReports, ReportActions, ReceiveReports, ReceiveFilteredReports } from './actions';

export interface TestReportState {
  testReports: TestReport[];
  filteredReports: TestReport[];
  filter: TestSuiteStatus;
}

const initialState: TestReportState = {
  testReports: [],
  filteredReports: [],
  filter: TestSuiteStatus.failed
};

export const reportsReducer = (state = initialState, action: ReportActions) => {
  switch (action.type) {
    case ReportActionTypes.Receive: {
      const {
        payload: { testReports }
      } = <ReceiveReports>action;

      return {
        ...state,
        testReports
      };
    }
    case ReportActionTypes.Filter: {
      const {
        payload: { filter }
      } = <FilterReports>action;

      return {
        ...state,
        filter
      };
    }
    case ReportActionTypes.ReceiveFiltered: {
      const {
        payload: { testReports }
      } = <ReceiveFilteredReports>action;

      return {
        ...state,
        filteredReports: testReports
      };
    }
    default:
      return state;
  }
};
