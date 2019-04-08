import { PerformanceActionTypes, PerformanceActions, ReceivePerformance } from './actions';
import { Performance } from 'src/app/models/performance.model';

const initialState: Performance = {
  durationInMilliseconds: null,
  metrics: null
};

export default (state = initialState, action: PerformanceActions) => {
  switch (action.type) {
    case PerformanceActionTypes.Receive:
      const { payload: performance } = <ReceivePerformance>action;

      return performance;
    default:
      return state;
  }
};