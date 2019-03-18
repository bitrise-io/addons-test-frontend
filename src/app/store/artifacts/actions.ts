import { Action } from '@ngrx/store';

export enum ArtifactActionTypes {
  Fetch = '[Artifact] Load',
  Receive = '[Artifact] Receive'
}

export class FetchArtifact implements Action {
  readonly type = ArtifactActionTypes.Fetch;
}

export class ReceiveArtifact implements Action {
  readonly type = ArtifactActionTypes.Receive;
}

export type ArtifactActions = FetchArtifact | ReceiveArtifact;
