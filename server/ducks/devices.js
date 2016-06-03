import { HueApi, lightState } from 'node-hue-api';

import { hueController } from '../controllers';
import { config } from '../environment';
import { handleAction, cylonEye } from '../utils';

import { LIGHT_STRIP_PRIMARY,
         LIGHT_STRIP_PRIMARY_LENGTH } from '../constants';

export const EMIT_REGISTER_ACCESSORIES = 'EMIT_REGISTER_ACCESSORIES';
export const EMIT_REGISTER_BRIDGE = 'EMIT_REGISTER_BRIDGE';
export const EMIT_TURN_ON_LIGHT = 'EMIT_TURN_ON_LIGHT';
export const EMIT_TURN_OFF_LIGHT = 'EMIT_TURN_OFF_LIGHT';
export const EMIT_SERIAL_DATA_CHANGE = 'EMIT_SERIAL_DATA_CHANGE';

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
      state.hueBridge.getLightStatus(2).then((lightStatus) => {
        if (lightStatus.state.on) {
          reducers.EMIT_TURN_OFF_LIGHT();
          cylonEye.stop();
        } else {
          reducers.EMIT_TURN_ON_LIGHT();
          cylonEye.start(state[LIGHT_STRIP_PRIMARY], LIGHT_STRIP_PRIMARY_LENGTH);
        }
      });

      return state;
    }
  };

  return handleAction(state, action, reducers);
};

export default devicesReducer;
