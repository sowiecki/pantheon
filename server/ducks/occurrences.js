/* eslint new-cap:0 */
import { lightState } from 'node-hue-api';
import { get } from 'lodash';

import { handleAction, toggleLights, logActionType } from 'utils';

export const EMIT_HUE_SWITCH = 'EMIT_HUE_SWITCH';
export const EMIT_TRIGGER_PHOTON_FUNCTION = 'EMIT_TRIGGER_PHOTON_FUNCTION';
export const EMIT_FORWARD_HTTP_REQUEST = 'EMIT_FORWARD_HTTP_REQUEST';
export const EMIT_SEND_UNIFIED_COMMAND = 'EMIT_SEND_UNIFIED_COMMAND';

const initialState = {
  lightState,
  isDeadboltLocked: false,
  isDoorClosed: false
};

const occurrencesReducer = (state = initialState, action) => {
  const hueBridge = get(action, 'devicesReducer.hueBridge');

  logActionType(action.type);

  const reducers = {
    [EMIT_HUE_SWITCH]() {
      const newLightState = state.lightState.create();

      if (typeof action.value === 'number') {
        hueBridge.setLightState(action.id, newLightState.bri(action.value));
      } else if (action.value === 'toggle') {
        toggleLights(hueBridge, state, action.id);
      } else if (newLightState[action.value]) {
        hueBridge.setLightState(action.id, newLightState[action.value]());
        hueBridge.setLightState(action.id, newLightState.bri(255));
      }
    }
  };

  return handleAction(state, action, reducers);
};

export default occurrencesReducer;
