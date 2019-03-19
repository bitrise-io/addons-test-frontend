import { performanceReducer } from './reducer';
import { ReceivePerformance, PerformanceActions } from './actions';
import { Performance } from 'src/app/models/performance.model';

describe('Performance reducer', () => {
  const initialState: Performance = {
    durationInMilliseconds: null,
    metrics: null
  };

  it('updates the state with performance received', () => {
    const performance: Performance = {
      durationInMilliseconds: 1234,
      metrics: {
        cpu: { name: 'cpu-metric', currentTimeInMilliseconds: 5678, sampleGroups: [] },
        memory: null,
        network: null
      }
    };

    const newState = performanceReducer(initialState, new ReceivePerformance(performance));

    expect(newState).toBe(performance);
  });

  it("doesn't update the state for an unknown action", () => {
    const newState = performanceReducer(initialState, <PerformanceActions>(<unknown>{ type: 'Unknown' }));

    expect(newState).toBe(initialState);
  });
});
