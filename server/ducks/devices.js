/* eslint new-cap:0 */
/* globals setTimeout */
import { HueApi, lightState } from 'node-hue-api';

import { config } from '../environment';
import { handleAction, cylonEye, unauthorizedFlash, sing } from '../utils';

import { LIGHT_STRIP_PRIMARY,
         LIGHT_STRIP_PRIMARY_LENGTH,
         PIEZO_PRIMARY } from '../constants';

export const EMIT_REGISTER_ACCESSORIES = 'EMIT_REGISTER_ACCESSORIES';
export const EMIT_REGISTER_BRIDGE = 'EMIT_REGISTER_BRIDGE';
export const EMIT_TURN_ON_LIGHT = 'EMIT_TURN_ON_LIGHT';
export const EMIT_TURN_OFF_LIGHT = 'EMIT_TURN_OFF_LIGHT';
export const EMIT_SERIAL_DATA_CHANGE = 'EMIT_SERIAL_DATA_CHANGE';
export const EMIT_MIC_VALUE_CHANGE = 'EMIT_MIC_VALUE_CHANGE';
export const EMIT_BUZZ = 'EMIT_BUZZ';

const initialState = {
  ports: config.ports,
  lightState: lightState.create(),
  hueUserId: config.users[Object.keys(config.users)[0]]
};

const devicesReducer = (state = initialState, action) => {
  const reducers = {
    [EMIT_REGISTER_ACCESSORIES]() {
      Object.keys(action.accessories).forEach((accessoryKey) => {
        state[accessoryKey] = action.accessories[accessoryKey];
      });

      cylonEye.start(state[LIGHT_STRIP_PRIMARY], LIGHT_STRIP_PRIMARY_LENGTH);

      return state;
    },

    [EMIT_REGISTER_BRIDGE]() {
      state.hueBridge = new HueApi(action.bridge.ipaddress, state.hueUserId);

      return state;
    },

    [EMIT_TURN_ON_LIGHT]() {
      state.hueBridge.setLightState(2, state.lightState.on());

      return state;
    },

    [EMIT_TURN_OFF_LIGHT]() {
      state.hueBridge.setLightState(2, state.lightState.off());

      return state;
    },

    [EMIT_SERIAL_DATA_CHANGE]() {
      const strip = state[LIGHT_STRIP_PRIMARY];

      if (!strip) return state;

      const authorized = config.users.nfc.indexOf(parseInt(action.data, 10)) > -1;

      if (!authorized) {
        cylonEye.stop(strip);
        unauthorizedFlash(strip);
        setTimeout(() => cylonEye.start(strip, LIGHT_STRIP_PRIMARY_LENGTH), 500);
        return state;
      }

      sing(state[PIEZO_PRIMARY]);

      state.hueBridge.getLightStatus(2).then((lightStatus) => {
        if (lightStatus.state.on) {
          reducers.EMIT_TURN_OFF_LIGHT();
        } else {
          reducers.EMIT_TURN_ON_LIGHT();
        }
      });

      return state;
    },

    [EMIT_MIC_VALUE_CHANGE]() {
      // TODO stuff
    }
  };

  return handleAction(state, action, reducers);
};

export default devicesReducer;
