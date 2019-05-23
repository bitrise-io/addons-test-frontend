import { AppActionTypes, AppActions, ReceiveApp } from './actions';

export interface AppStoreState {
  slug: string;
  name: string;
}

const initialState: AppStoreState = {
  slug: undefined,
  name: undefined
};

export function AppReducer(state = initialState, action: AppActions) {
  switch (action.type) {
    case AppActionTypes.Receive:
      const {
        payload: { slug, name }
      } = <ReceiveApp>action;

      return {
        slug: slug,
        name: name
      };
    default:
      return state;
  }
}
