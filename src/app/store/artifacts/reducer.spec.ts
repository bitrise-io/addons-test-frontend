import artifactsReducer, { ArtifactStoreState } from './reducer';
import { ReceiveArtifact, ArtifactActions } from './actions';
import { TestArtifact } from 'src/app/models/test-artifact.model';

describe('Artifacts reducer', () => {
  const initialState: ArtifactStoreState = {
    testArtifacts: []
  };

  it('updates the state with artifacts received', () => {
    const newState = artifactsReducer(
      initialState,
      new ReceiveArtifact({
        testArtifacts: [new TestArtifact().deserialize({ filename: 'filename', downloadURL: 'download-url' })]
      })
    );

    expect(newState.testArtifacts.length).toBe(1);
  });

  it(`doesn't update the state for an unknown action`, () => {
    const newState = artifactsReducer(initialState, <ArtifactActions>(<unknown>{ type: 'Unknown' }));

    expect(newState).toBe(initialState);
  });
});
