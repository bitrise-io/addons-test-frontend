import { ArtifactActionTypes, ArtifactActions } from './actions';
import { TestArtifactResponse, TestArtifact } from 'src/app/models/test-artifact.model';

import * as MOCKED_DATA from '../../mocked-data.json';

interface ArtifactStoreState {
  testArtifacts: TestArtifact[];
  downloadAllUrl: string;
}

const initialState: ArtifactStoreState = {
  testArtifacts: [],
  downloadAllUrl: null
};

export const testArtifactStoreReducer = (state = initialState, action: ArtifactActions) => {
  switch (action.type) {
    case ArtifactActionTypes.Receive:
      return {
        testArtifacts: MOCKED_DATA['test_artifacts']['list'].map((testArtifactResponse: TestArtifactResponse) =>
          new TestArtifact().deserialize(testArtifactResponse)
        ),
        downloadAllURL: MOCKED_DATA['test_artifacts']['downloadAllURL']
      };
    default:
      return state;
  }
};
