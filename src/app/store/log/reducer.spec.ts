import logReducer, { LogStoreState } from './reducer';
import { ReceiveLog, LogActions } from './actions';
import { Log } from 'src/app/models/log.model';

describe('Log reducer', () => {
  const initialState: LogStoreState = {
    log: null,
    downloadURL: null
  };

  it('updates the state with iOS log', () => {
    const newState = logReducer(
      initialState,
      new ReceiveLog({
        log: new Log().deserialize('Jan  3 06:16:37 iPhone locationd[64] <Notice>: @WifiFlow, nexttimer, 15\nJan  3 06:16:37 iPhone locationd[64] <Notice>: @WifiFlow, nexttimer, 15'),
        downloadURL: 'download-url'
      })
    );

    expect(newState.log.lines.length).toBe(2);
    expect(newState.downloadURL).toBe('download-url');
  });

  it('updates the state with Android log', () => {
    const newState = logReducer(
      initialState,
      new ReceiveLog({
        log: new Log().deserialize('01-01 08:00:04.123: I/Remoter(3): Sed eu luctus ex\n01-01 08:00:04.123: I/Remoter(3): Sed eu luctus ex'),
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
