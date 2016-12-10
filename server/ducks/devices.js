import { HueApi } from 'node-hue-api';

import { config } from 'environment';
import { handleAction,
         registerAccessories,
         rain } from 'utils';
import { DESK_LIGHT_STRIP_PRIMARY,
         DESK_LIGHT_STRIP_PRIMARY_LENGTH } from 'constants';

export const FETCH_UNIFIED_ID = 'FETCH_UNIFIED_ID';
export const EMIT_REGISTER_UNIFIED_ID = 'EMIT_REGISTER_UNIFIED_ID';

export const SEND_UNIFIED_COMMAND = 'SEND_UNIFIED_COMMAND';
export const BATCH_UNIFIED_COMMANDS = 'BATCH_UNIFIED_COMMANDS';

export const EMIT_REGISTER_DESK_ACCESSORIES = 'EMIT_REGISTER_DESK_ACCESSORIES';
export const EMIT_REGISTER_BRIDGE = 'EMIT_REGISTER_BRIDGE';

const initialState = {
  ports: config.ports,
  hueUserId: config.users[Object.keys(config.users)[0]],
};

const devicesReducer = (state = initialState, action) => {
  const reducers = {
    [EMIT_REGISTER_DESK_ACCESSORIES]() {
      const newState = registerAccessories(state, action.accessories);

      rain.start(newState[DESK_LIGHT_STRIP_PRIMARY], DESK_LIGHT_STRIP_PRIMARY_LENGTH);

      return newState;
    },

    [EMIT_REGISTER_BRIDGE]() {
      return {
        ...state,
        hueBridge: new HueApi(action.bridge.ipaddress, state.hueUserId)
      };
    },

    [EMIT_REGISTER_UNIFIED_ID]() {
      return {
        ...state,
        unifiedID: action.unifiedID
      };
    }
  };

  return handleAction(state, action, reducers);
};

export default devicesReducer;
