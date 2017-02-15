import { HueApi } from 'node-hue-api';
import { get } from 'lodash';

import { config } from 'environment';
import { handleAction } from 'utils';

export const FETCH_UNIFIED_ID = 'FETCH_UNIFIED_ID';
export const EMIT_REGISTER_UNIFIED_ID = 'EMIT_REGISTER_UNIFIED_ID';
export const EMIT_REGISTER_BRIDGE = 'EMIT_REGISTER_BRIDGE';

const initialState = {
  hue: {
    userIDs: get(config, 'hueUserIDs', {})
  }
};

const devicesReducer = (state = initialState, action) => {
  const reducers = {
    [EMIT_REGISTER_BRIDGE]() {
      const { ipaddress } = action.bridge;

      return {
        ...state,
        hue: {
          ...state.hue,
          [ipaddress]: {
            bridge: new HueApi(ipaddress, state.hue.userIDs[ipaddress]),
            userID: action.userID
          }
        }
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
