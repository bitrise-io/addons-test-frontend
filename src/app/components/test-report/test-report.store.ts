import { Action } from '@ngrx/store';
import { TestReport, TestReportResponse } from '../../models/test-report.model';
import { TestArtifact, TestArtifactResponse } from '../../models/test-artifact.model';
import * as MOCKED_DATA from '../../mocked-data.json';

enum TestReportStoreAction {
  load = 'testReportLoad'
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

const initialTestReportState: TestReport[] = undefined;
const initialTestArtifactState: TestArtifact[] = undefined;

export function testReportStoreReducer(state = initialTestReportState, action: Action) {
  switch (action.type) {
    case TestReportStoreAction.load:
      return MOCKED_DATA['test_reports'].map((testReportResponse: TestReportResponse) =>
        new TestReport().deserialize(testReportResponse)
      );
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
