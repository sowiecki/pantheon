import { HueApi } from 'node-hue-api';
import { get } from 'lodash';

import { config } from 'environment';
import { handleAction } from 'utils';

export const FETCH_UNIFIED_ID = 'FETCH_UNIFIED_ID';
export const EMIT_REGISTER_UNIFIED_ID = 'EMIT_REGISTER_UNIFIED_ID';
export const EMIT_REGISTER_BRIDGE = 'EMIT_REGISTER_BRIDGE';

const initialState = {
  hueUserID: get(config, 'hue.userID'),
};

const devicesReducer = (state = initialState, action) => {
  const reducers = {
    [EMIT_REGISTER_BRIDGE]() {
      return {
        ...state,
        hueBridge: new HueApi(action.bridge.ipaddress, state.hueUserID)
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
