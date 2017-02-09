/* eslint new-cap:0, no-eval:0 */
import { lightState } from 'node-hue-api';
import { mapValues, get } from 'lodash';

import { config } from 'environment';
import { EVENT_EMITTERS_MAP } from 'constants';
import { initCustomState, handleAction, toggleLights, logActionType, logUndefinedHandler } from 'utils';

export const EMIT_HUE_SWITCH = 'EMIT_HUE_SWITCH';
export const EMIT_TRIGGER_PHOTON_FUNCTION = 'EMIT_TRIGGER_PHOTON_FUNCTION';
export const EMIT_FORWARD_HTTP_REQUEST = 'EMIT_FORWARD_HTTP_REQUEST';
export const EMIT_SEND_UNIFIED_COMMAND = 'EMIT_SEND_UNIFIED_COMMAND';
export const EMIT_CUSTOM_STATE_UPDATE = 'EMIT_CUSTOM_STATE_UPDATE';

const initialState = {
  lightState,
  ...mapValues(initCustomState(config), 'default')
};

const occurrencesReducer = (state = initialState, action) => {
  const hueBridge = get(action, 'devicesReducer.hueBridge');

  logActionType(action.type);

  const reducers = {
    [EMIT_HUE_SWITCH]() {
      const newLightState = state.lightState.create();

      if (typeof action.value === 'number') {
        hueBridge.setLightState(action.id, newLightState.bri(action.value));
      } else if (action.value === 'toggle') {
        toggleLights(hueBridge, state, action.id);
      } else if (newLightState[action.value]) {
        hueBridge.setLightState(action.id, newLightState[action.value]());
        hueBridge.setLightState(action.id, newLightState.bri(255));
      }
    },

    [EMIT_CUSTOM_STATE_UPDATE](customStateConfig) {
      action.$state.forEach((customStateKey) => {
        try {
          const customStateHandler = eval(customStateConfig[customStateKey].$handler);

          state[customStateKey] = customStateHandler(state[customStateKey]);
        } catch (e) {
          logUndefinedHandler(e);
        }
      });

      return { ...state };
    }
  };

  const eventKey = EVENT_EMITTERS_MAP[action.type];
  const customStateConfig = get(config[eventKey], `${action.key}.$state`);

  if (customStateConfig && action.$state) {
    reducers[EMIT_CUSTOM_STATE_UPDATE](customStateConfig);
  }

  return handleAction(state, action, reducers);
};

export default occurrencesReducer;
