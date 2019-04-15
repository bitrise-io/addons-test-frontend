import { LogActionTypes, LogActions, ReceiveLog } from './actions';
import { Log } from 'src/app/models/log.model';

export interface LogStoreState {
  log: Log;
  downloadURL: string;
}

const initialState: LogStoreState = {
  log: null,
  downloadURL: null
};

export default (state = initialState, action: LogActions) => {
  switch (action.type) {
    case LogActionTypes.Receive:
      const {
        payload: { log, downloadURL }
      } = <ReceiveLog>action;

      return {
        ...state,
        log,
        downloadURL
      };
    default:
      return state;
  }
};
