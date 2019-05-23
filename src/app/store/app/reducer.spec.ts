import { AppReducer, AppStoreState } from './reducer';
import { ReceiveApp, AppActions } from './actions';

describe('App reducer', () => {
  const initialState: AppStoreState = {
    slug: undefined,
    name: undefined
  };

  it('updates the state with artifacts received', () => {
    const newState = AppReducer(
      initialState,
      new ReceiveApp({
        slug: 'my-app-slug',
        name: 'My app'
      })
    );

    expect(newState.slug).toBe('my-app-slug');
    expect(newState.name).toBe('My app');
  });

  it(`doesn't update the state for an unknown action`, () => {
    const newState = AppReducer(initialState, <AppActions>(<unknown>{ type: 'Unknown' }));

    expect(newState).toBe(initialState);
  });
});
