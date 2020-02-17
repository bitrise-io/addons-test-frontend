import { TestReport } from 'src/app/models/test-report.model';
import { TestSuiteStatus } from 'src/app/models/test-suite.model';
import { ReportActionTypes, FilterReports, ReportActions, ReceiveReports, ReceiveFilteredReports } from './actions';

export interface TestReportState {
  testReports: TestReport[];
  filteredReports: TestReport[];
  filter: TestSuiteStatus;
  isLoading: boolean;
}

const initialState: TestReportState = {
  testReports: [],
  filteredReports: [],
  isLoading: true,
  filter: TestSuiteStatus.failed
};

export function ReportsReducer(state = initialState, action: ReportActions) {
  switch (action.type) {
    case ReportActionTypes.Receive: {
      const {
        payload: { testReports }
      } = <ReceiveReports>action;

      return {
        ...state,
        isLoading: false,
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
}
