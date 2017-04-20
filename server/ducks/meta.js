import { lightState } from 'node-hue-api';
import { mapValues, get } from 'lodash';

import { ENV } from 'config';
import { initCustomState, generateReducers, handleAction, logActionType } from 'utils';
import devicesReducer from './devices';
import occurrencesReducer from './occurrences';

const initialState = {
  ...mapValues(initCustomState(ENV), 'default'),
  hue: {
    userIDs: get(ENV, 'hueUserIDs', {})
  },
  lightState
};

const metaReducer = (state = initialState, action) => {
  logActionType(action.type);

  const reducers = generateReducers(state, action, [
    devicesReducer,
    occurrencesReducer
  ]);

  return handleAction(state, action, reducers);
};

export default metaReducer;
