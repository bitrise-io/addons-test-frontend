import { Action } from '@ngrx/store';

import { TestReport } from 'src/app/models/test-report.model';
import { TestSuite } from 'src/app/models/test-suite.model';
import { TestArtifactsResult } from 'src/app/services/backend/backend.model';

export enum ArtifactActionTypes {
  Fetch = '[Artifact] Load',
  Receive = '[Artifact] Receive'
}

export class FetchArtifact implements Action {
  readonly type = ArtifactActionTypes.Fetch;

  constructor(public payload: { testReport: TestReport, testSuite: TestSuite}) {}
}

export class ReceiveArtifact implements Action {
  readonly type = ArtifactActionTypes.Receive;

  constructor(public payload: TestArtifactsResult) {}
}

export type ArtifactActions = FetchArtifact | ReceiveArtifact;
