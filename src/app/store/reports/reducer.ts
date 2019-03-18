import { TestReport, TestReportResponse } from 'src/app/models/test-report.model';
import { TestSuiteStatus } from 'src/app/models/test-suite.model';
import { ReportActionTypes, FilterReports, ReportActions } from './actions';

import * as MOCKED_DATA from 'src/app/mocked-data.json';

export interface TestReportStoreState {
  testReports: TestReport[];
  filteredReports: TestReport[];
  filter: TestSuiteStatus;
}

const initialState: TestReportStoreState = {
  testReports: [],
  filteredReports: [],
  filter: TestSuiteStatus.failed
};

function filterReports(reports: TestReport[], status: TestSuiteStatus) {
  if (status || status === 0) {
    return reports.map(report => {
      const newReport = Object.assign(new TestReport(), report);
      if (report.testCases) {
        newReport.testCases = report.testCases.filter(x => Number(x.status) === status);
      } else if (report.testSuites) {
        newReport.testSuites = report.testSuites.filter(x => Number(x.status) === status);
      }
      return newReport;
    });
  } else {
    return reports;
  }
}

export const testReportStoreReducer = (state = initialState, action: ReportActions) => {
  switch (action.type) {
    case ReportActionTypes.Fetch:
      const testReports = MOCKED_DATA['test_reports'].map((testReportResponse: TestReportResponse) =>
        new TestReport().deserialize(testReportResponse)
      );
      return {
        testReports,
        filteredReports: filterReports(testReports, state.filter),
        filter: state.filter
      };
    case ReportActionTypes.Filter:
      const filter = (<FilterReports>action).filter;
      return {
        testReports: state.testReports,
        filteredReports: filterReports(state.testReports, filter),
        filter
      };
    default:
      return state;
  }
};
