import { ArtifactActionTypes, ArtifactActions, ReceiveArtifact } from './actions';
import { TestArtifact } from 'src/app/models/test-artifact.model';

export interface ArtifactStoreState {
  testArtifacts: TestArtifact[];
  downloadAllURL: string;
}

const initialState: ArtifactStoreState = {
  testArtifacts: [],
  downloadAllURL: null
};

export default (state = initialState, action: ArtifactActions) => {
  switch (action.type) {
    case ArtifactActionTypes.Receive:
      const {
        payload: { testArtifacts, downloadAllURL }
      } = <ReceiveArtifact>action;

      return {
        ...state,
        testArtifacts,
        downloadAllURL
      };
    default:
      return state;
  }
};
