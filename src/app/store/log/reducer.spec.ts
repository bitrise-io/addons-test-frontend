import logReducer, { LogStoreState } from './reducer';
import { ReceiveLog, LogActions } from './actions';
import { Log } from 'src/app/models/log.model';

describe('Log reducer', () => {
  const initialState: LogStoreState = {
    log: null,
    downloadURL: null
  };

  it('updates the state with log', () => {
    const newState = logReducer(
      initialState,
      new ReceiveLog({
        log: new Log().deserialize('test log line #1\ntest log line #2'),
        downloadURL: 'download-url'
      })
    );

    expect(newState.log.lines.length).toBe(2);
    expect(newState.downloadURL).toBe('download-url');
  });

  it(`doesn't update the state for an unknown action`, () => {
    const newState = logReducer(initialState, <LogActions>(<unknown>{ type: 'Unknown' }));

    expect(newState).toBe(initialState);
  });
});
