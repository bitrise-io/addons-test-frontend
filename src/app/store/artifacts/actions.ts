import { Action } from '@ngrx/store';

import { TestArtifactsResult } from 'src/app/services/backend/backend.model';

export enum ArtifactActionTypes {
  Fetch = '[Artifact] Load',
  Receive = '[Artifact] Receive'
}

export class FetchArtifact implements Action {
  readonly type = ArtifactActionTypes.Fetch;
}

export class ReceiveArtifact implements Action {
  readonly type = ArtifactActionTypes.Receive;

  constructor(public payload: TestArtifactsResult) {}
}

export type ArtifactActions = FetchArtifact | ReceiveArtifact;
