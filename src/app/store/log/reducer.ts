import { LogActionTypes, LogActions, ReceiveLog } from './actions';
import { Log } from 'src/app/models/log.model';

export interface LogStoreState {
  logs: {
    [testReportId: string]: {
      [testSuiteId: string]: {
        log: Log;
        downloadURL: string;
      };
    };
  };
}

const initialState: LogStoreState = {
  logs: null
};

export default (state = initialState, action: LogActions) => {
  switch (action.type) {
    case LogActionTypes.Receive:
      const {
        payload: { logs }
      } = <ReceiveLog>action;

      return {
        ...state,
        logs
      };
    default:
      return state;
  }
};
