import { HueApi } from 'node-hue-api';

export const FETCH_UNIFIED_ID = 'FETCH_UNIFIED_ID';
export const EMIT_REGISTER_UNIFIED_ID = 'EMIT_REGISTER_UNIFIED_ID';
export const EMIT_REGISTER_BRIDGE = 'EMIT_REGISTER_BRIDGE';

const devicesReducer = (state, action) => ({
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
});

export default devicesReducer;
