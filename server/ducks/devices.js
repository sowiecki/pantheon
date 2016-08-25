/* eslint new-cap:0 */
/* globals setTimeout */
import { HueApi, lightState } from 'node-hue-api';

import { config } from '../environment';
import { handleAction, registerAccessories, cylonEye } from '../utils';

import { DESK_LIGHT_STRIP_PRIMARY,
         DESK_LIGHT_STRIP_PRIMARY_LENGTH,
         DEADBOLT_LED,
         DEADBOLT_PUSH_BUTTON,
         BUTTON_PRESS_TIMEOUT } from '../constants';

export const EMIT_REGISTER_DESK_ACCESSORIES = 'EMIT_REGISTER_DESK_ACCESSORIES';
export const EMIT_REGISTER_BRIDGE = 'EMIT_REGISTER_BRIDGE';

export const EMIT_LR_LIGHT_ON = 'EMIT_LR_LIGHT_ON';
export const EMIT_LR_LIGHT_OFF = 'EMIT_LR_LIGHT_OFF';
export const EMIT_DR_LIGHT_ON = 'EMIT_DR_LIGHT_ON';
export const EMIT_DR_LIGHT_OFF = 'EMIT_DR_LIGHT_OFF';

export const EMIT_DESK_MIC_VALUE_CHANGE = 'EMIT_MIC_VALUE_CHANGE';
export const EMIT_BUZZ = 'EMIT_BUZZ';

export const EMIT_REGISTER_DEADBOLT_ACCESSORIES = 'EMIT_REGISTER_DEADBOLT_ACCESSORIES';
export const EMIT_DEADBOLT_PUSH_BUTTON_PRESS = 'EMIT_DEADBOLT_PUSH_BUTTON_PRESS';
export const EMIT_DEADBOLT_SENSOR_CHANGE = 'EMIT_DEADBOLT_SENSOR_CHANGE';

const initialState = {
  ports: config.ports,
  lightState: lightState.create(),
  hueUserId: config.users[Object.keys(config.users)[0]],
  isDeadboltLocked: false,
  isDoorClosed: false
};

const devicesReducer = (state = initialState, action) => {
  const reducers = {
    [EMIT_REGISTER_DESK_ACCESSORIES]() {
      const newState = registerAccessories(state, action.accessories);

      cylonEye.start(newState[DESK_LIGHT_STRIP_PRIMARY], DESK_LIGHT_STRIP_PRIMARY_LENGTH);

      return newState;
    },

    [EMIT_REGISTER_DEADBOLT_ACCESSORIES]() {
      return registerAccessories(state, action.accessories);
    },

    [EMIT_REGISTER_BRIDGE]() {
      return {
        ...state,
        hueBridge: new HueApi(action.bridge.ipaddress, state.hueUserId)
      };
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

    [EMIT_DEADBOLT_SENSOR_CHANGE]() {
      if (action.value) {
        state[DEADBOLT_LED].fadeIn();

        setTimeout(() => state[DEADBOLT_LED].fadeOut(), 500);
      }

      return state;
    },

    [EMIT_DEADBOLT_PUSH_BUTTON_PRESS]() {
      if (action.passcode === config.id) {
        action.next.body = 200;
        state[DEADBOLT_PUSH_BUTTON].high();

        setTimeout(() => {
          state[DEADBOLT_PUSH_BUTTON].low();
        }, BUTTON_PRESS_TIMEOUT);
      } else {
        action.next.body = 401;
      }

      return state;
    }
  };

  return handleAction(state, action, reducers);
};

export default devicesReducer;
