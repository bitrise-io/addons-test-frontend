import { ArtifactActionTypes, ArtifactActions, ReceiveArtifact } from './actions';
import { TestArtifact } from 'src/app/models/test-artifact.model';

export interface ArtifactStoreState {
  testArtifacts: TestArtifact[];
}

const initialState: ArtifactStoreState = {
  testArtifacts: []
};

export function ArtifactsReducer(state = initialState, action: ArtifactActions) {
  switch (action.type) {
    case ArtifactActionTypes.Receive:
      const {
        payload: { testArtifacts }
      } = <ReceiveArtifact>action;

      return {
        ...state,
        testArtifacts
      };
    default:
      return state;
  }
};
