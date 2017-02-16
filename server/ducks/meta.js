import { lightState } from 'node-hue-api';
import { mapValues, get } from 'lodash';

import { config } from 'environment';
import { initCustomState, generateReducers, handleAction, logActionType } from 'utils';
import { EVENT_EMITTERS_MAP } from 'constants';
import devicesReducer from './devices';
import occurrencesReducer, { EMIT_CUSTOM_STATE_UPDATE } from './occurrences';

const initialState = {
  ...mapValues(initCustomState(config), 'default'),
  hue: {
    userIDs: get(config, 'hueUserIDs', {})
  },
  lightState
};

const metaReducer = (state = initialState, action) => {
  logActionType(action.type);

  const reducers = generateReducers(state, action, [
    devicesReducer,
    occurrencesReducer
  ]);

  const eventKey = EVENT_EMITTERS_MAP[action.type];
  const customStateConfig = get(config[eventKey], `${action.key}.$state`);

  if (customStateConfig && action.$state) {
    reducers[EMIT_CUSTOM_STATE_UPDATE](customStateConfig);
  }

  return handleAction(state, action, reducers);
};

export default metaReducer;
