import { Action } from '@ngrx/store';
import { TestReport, TestReportResponse } from '../../models/test-report.model';
import { TestArtifact, TestArtifactResponse } from '../../models/test-artifact.model';
import * as MOCKED_DATA from '../../mocked-data.json';
import { TestSuiteStatus } from 'src/app/models/test-suite.model';

enum TestReportStoreAction {
  load = 'testReportLoad',
  filter = 'testReportFilter'
}

enum TestArtifactStoreAction {
  load = 'testArtifactLoad'
}

export class TestReportStoreActionLoad implements Action {
  readonly type = TestReportStoreAction.load;
}

export class TestArtifactStoreActionLoad implements Action {
  readonly type = TestArtifactStoreAction.load;
}

export class TestReportStoreActionFilter implements Action {
  readonly type = TestReportStoreAction.filter;

  constructor(public filter: TestSuiteStatus) {}
}

const initialTestReportState: TestReportStoreState = {
  testReports: [],
  filteredReports: [],
  filter: TestSuiteStatus.failed
};
const initialTestArtifactState: any = undefined;

function filterReports(reports: TestReport[], status: TestSuiteStatus) {
  if (status || status === 0) {
    return reports.map((report) => {
      const newReport = Object.assign(new TestReport(), report);
      if (report.testCases) {
        newReport.testCases = report.testCases.filter((x) => Number(x.status) === status);
      } else if (report.testSuites) {
        newReport.testSuites = report.testSuites.filter((x) => Number(x.status) === status);
      }
      return newReport;
    });
  } else {
    return reports;
  }
}

export function testReportStoreReducer(state = initialTestReportState, action: Action) {
  switch (action.type) {
    case TestReportStoreAction.load:
      const testReports = MOCKED_DATA['test_reports'].map((testReportResponse: TestReportResponse) =>
        new TestReport().deserialize(testReportResponse)
      );
      return {
        testReports,
        filteredReports: filterReports(testReports, state.filter),
        filter: state.filter
      };
    case TestReportStoreAction.filter:
      const filter = (<TestReportStoreActionFilter>action).filter;
      return {
        testReports: state.testReports,
        filteredReports: filterReports(state.testReports, filter),
        filter
      };
    default:
      return state;
  }
}

export function testArtifactStoreReducer(state = initialTestArtifactState, action: Action) {
  switch (action.type) {
    case TestArtifactStoreAction.load:
      return {
        testArtifacts: MOCKED_DATA['test_artifacts']['list'].map((testArtifactResponse: TestArtifactResponse) =>
          new TestArtifact().deserialize(testArtifactResponse)
        ),
        downloadAllURL: MOCKED_DATA['test_artifacts']['downloadAllURL']
      };
    default:
      return state;
  }
}

export interface TestReportStoreState {
  testReports: TestReport[];
  filteredReports: TestReport[];
  filter: TestSuiteStatus;
}
