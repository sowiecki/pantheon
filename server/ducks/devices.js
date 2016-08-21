/* eslint new-cap:0 */
/* globals setTimeout */
import { HueApi, lightState } from 'node-hue-api';
import { merge } from 'lodash';

import { config } from '../environment';
import { handleAction, cylonEye } from '../utils';

import { LIGHT_STRIP_PRIMARY,
         LIGHT_STRIP_PRIMARY_LENGTH,
         DEADBOLT_LED,
         DEADBOLT_LED_TIMEOUT,
         DEADBOLT_SERVO } from '../constants';

export const EMIT_REGISTER_DESK_ACCESSORIES = 'EMIT_REGISTER_DESK_ACCESSORIES';
export const EMIT_REGISTER_BRIDGE = 'EMIT_REGISTER_BRIDGE';

export const EMIT_LR_LIGHT_ON = 'EMIT_LR_LIGHT_ON';
export const EMIT_LR_LIGHT_OFF = 'EMIT_LR_LIGHT_OFF';
export const EMIT_DR_LIGHT_ON = 'EMIT_DR_LIGHT_ON';
export const EMIT_DR_LIGHT_OFF = 'EMIT_DR_LIGHT_OFF';

export const EMIT_SERIAL_DATA_CHANGE = 'EMIT_SERIAL_DATA_CHANGE';
export const EMIT_DESK_MIC_VALUE_CHANGE = 'EMIT_MIC_VALUE_CHANGE';
export const EMIT_BUZZ = 'EMIT_BUZZ';

export const EMIT_REGISTER_DEADBOLT_ACCESSORIES = 'EMIT_REGISTER_DEADBOLT_ACCESSORIES';
export const EMIT_DEADBOLT_PUSH_BUTTON_PRESS = 'EMIT_DEADBOLT_PUSH_BUTTON_PRESS';
export const EMIT_DEADBOLT_NFC_BUTTON_PRESS = 'EMIT_DEADBOLT_NFC_BUTTON_PRESS';

const initialState = {
  ports: config.ports,
  lightState: lightState.create(),
  hueUserId: config.users[Object.keys(config.users)[0]],
  isDeadboltLocked: false
};

const toggleDeadboltState = (state) => { // TODO move to util file
  if (state.isDeadboltLocked) {
    state[DEADBOLT_SERVO].to(80);
  } else {
    state[DEADBOLT_SERVO].to(0);
  }

  state[DEADBOLT_LED].on();
  setTimeout(() => state[DEADBOLT_LED].off(), DEADBOLT_LED_TIMEOUT);

  return merge(state, {
    isDeadboltLocked: !state.isDeadboltLocked
  });
};

const devicesReducer = (state = initialState, action) => {
  const reducers = {
    [EMIT_REGISTER_DESK_ACCESSORIES]() {
      Object.keys(action.accessories).forEach((accessoryKey) => {
        state[accessoryKey] = action.accessories[accessoryKey];
      });

      cylonEye.start(state[LIGHT_STRIP_PRIMARY], LIGHT_STRIP_PRIMARY_LENGTH);

      return state;
    },

    [EMIT_REGISTER_DEADBOLT_ACCESSORIES]() {
      Object.keys(action.accessories).forEach((accessoryKey) => {
        state[accessoryKey] = action.accessories[accessoryKey];
      });

      return state;
    },

    [EMIT_REGISTER_BRIDGE]() {
      state.hueBridge = new HueApi(action.bridge.ipaddress, state.hueUserId);

      return state;
    },

    [EMIT_DR_LIGHT_ON]() {
      state.hueBridge.setLightState(1, state.lightState.on());

      return state;
    },

    [EMIT_DR_LIGHT_OFF]() {
      state.hueBridge.setLightState(1, state.lightState.off());

      return state;
    },

    [EMIT_LR_LIGHT_ON]() {
      state.hueBridge.setLightState(2, state.lightState.on());

      return state;
    },

    [EMIT_LR_LIGHT_OFF]() {
      state.hueBridge.setLightState(2, state.lightState.off());

      return state;
    },

    [EMIT_SERIAL_DATA_CHANGE]() {
      return state; // TODO stuff
    },

    [EMIT_DESK_MIC_VALUE_CHANGE]() {
      return state; // TODO stuff
    },

    [EMIT_DEADBOLT_PUSH_BUTTON_PRESS]() {
      return toggleDeadboltState(state);
    },

    [EMIT_DEADBOLT_NFC_BUTTON_PRESS]() {
      return toggleDeadboltState(state);
    }
  };

  return handleAction(state, action, reducers);
};

export default devicesReducer;
