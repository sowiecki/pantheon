/* eslint no-eval:0 */
import { get } from 'lodash';

import { config } from 'environment';
import { CUSTOM_LIGHT_FUNCTIONS } from 'constants';
import {
  toggleLight,
  logUndefinedHandler,
  errorLightStatus
} from 'utils';

export const EMIT_SEND_HUE_COMMAND = 'EMIT_SEND_HUE_COMMAND';
export const EMIT_TRIGGER_PHOTON_FUNCTION = 'EMIT_TRIGGER_PHOTON_FUNCTION';
export const EMIT_FORWARD_HTTP_REQUEST = 'EMIT_FORWARD_HTTP_REQUEST';
export const EMIT_SEND_UNIFIED_COMMAND = 'EMIT_SEND_UNIFIED_COMMAND';
export const EMIT_CUSTOM_STATE_UPDATE = 'EMIT_CUSTOM_STATE_UPDATE';

const occurrencesReducer = (state, action) => ({
  [EMIT_SEND_HUE_COMMAND]() {
    const { hue } = state;
    const ipaddress = action.ipaddress || Object.keys(hue.userIDs)[0];
    const hueBridge = get(hue, `['${ipaddress}'].bridge`);

    if (CUSTOM_LIGHT_FUNCTIONS.includes(action.func)) {
      switch (action.func) {
        case 'toggle':
          toggleLight(hueBridge, state, action.id);
          break;
        default:
          errorLightStatus();
          break;
      }
    } else {
      try {
        const newLightState = state.lightState.create()[action.func](action.arg);

        hueBridge.setLightState(action.id, newLightState);
      } catch (e) {
        errorLightStatus();
      }
    }

    return { ...state };
  },

  [EMIT_CUSTOM_STATE_UPDATE](customStateConfig) {
    action.$state.forEach((customStateKey) => {
      try {
        const forcedHandler = get(config, `${action.$path}.$state[${customStateKey}].$handler`);
        const riderHandler = () => customStateConfig[customStateKey].$handler;

        const customStateHandler = eval(forcedHandler || riderHandler());

        state[customStateKey] = customStateHandler(state[customStateKey]);
      } catch (e) {
        logUndefinedHandler(e);
      }
    });

    return { ...state };
  }
});

export default occurrencesReducer;
