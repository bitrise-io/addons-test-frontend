import { TestReport } from 'src/app/models/test-report.model';
import { TestSuiteStatus } from 'src/app/models/test-suite.model';
import { ReportActionTypes, FilterReportList, ReportActions, ReceiveReportList, ReceiveFilteredReportList } from './actions';

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

export default (state = initialState, action: ReportActions) => {
  switch (action.type) {
    case ReportActionTypes.ReceiveList: {
      const {
        payload: { testReports }
      } = <ReceiveReportList>action;

      return {
        ...state,
        testReports
      };
    }
    case ReportActionTypes.FilterList: {
      const {
        payload: { filter }
      } = <FilterReportList>action;

      return {
        ...state,
        filter
      };
    }
    case ReportActionTypes.ReceiveFilteredList: {
      const {
        payload: { testReports }
      } = <ReceiveFilteredReportList>action;

      return {
        ...state,
        filteredReports: testReports
      };
    }
    default:
      return state;
  }
};
