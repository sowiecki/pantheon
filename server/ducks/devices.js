import { HueApi, lightState } from 'node-hue-api';

import { hueController } from '../controllers';
import { config } from '../environment';
import { handleAction } from '../utils';

export const EMIT_REGISTER_BRIDGE = 'EMIT_REGISTER_BRIDGE';
export const EMIT_TURN_ON_LIGHT = 'EMIT_TURN_ON_LIGHT';
export const EMIT_TURN_OFF_LIGHT = 'EMIT_TURN_OFF_LIGHT';

const userId = config.users[Object.keys(config.users)[0]];

const initialState = {
  devices: {},
  lightState: lightState.create(),
  userId
};

const devicesReducer = (state = initialState, action) => {
  const reducers = {
    [EMIT_REGISTER_BRIDGE]() {
      state.api = new HueApi(action.bridge.ipaddress, state.userId);

      return state;
    },

    [EMIT_TURN_ON_LIGHT]() {
      state.api.setLightState(2, state.lightState.on());

      return state;
    },

    [EMIT_TURN_OFF_LIGHT]() {
      state.api.setLightState(2, state.lightState.off());

      return state;
    }
  };

  return handleAction(state, action, reducers);
};

export default devicesReducer;
