/* eslint new-cap:0 */
import { lightState } from 'node-hue-api';
import { get } from 'lodash';

import { handleAction,
         flashAuthorized,
         rain,
         colorGenerators,
         toggleLights } from 'utils';
import { DESK_LIGHT_STRIP_PRIMARY,
         DESK_LIGHT_STRIP_PRIMARY_LENGTH } from 'constants';

export const EMIT_HUE_SWITCH = 'EMIT_HUE_SWITCH';

export const EMIT_DESK_LIGHT_COLOR_FLASH = 'EMIT_DESK_LIGHT_COLOR_FLASH';
export const EMIT_DESK_MIC_VALUE_CHANGE = 'EMIT_MIC_VALUE_CHANGE';

export const EMIT_TRIGGER_PHOTON_FUNCTION = 'EMIT_TRIGGER_PHOTON_FUNCTION';

export const EMIT_BUZZ = 'EMIT_BUZZ';
export const EMIT_BUZZ_RESPONSE = 'EMIT_BUZZ_RESPONSE';

export const EMIT_SEND_UNIFIED_COMMAND = 'EMIT_SEND_UNIFIED_COMMAND';


const initialState = {
  lightState,
  isDeadboltLocked: false,
  isDoorClosed: false
};

const occurrencesReducer = (state = initialState, action) => {
  const hueBridge = get(action, 'devicesReducer.hueBridge');

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
    },

    [EMIT_DESK_LIGHT_COLOR_FLASH]() {
      const deskLight = action.devicesReducer[DESK_LIGHT_STRIP_PRIMARY];

      if (deskLight) {
        const color = colorGenerators[action.color] || colorGenerators.red;

        flashAuthorized(deskLight, color, () => {
          rain.start(deskLight, DESK_LIGHT_STRIP_PRIMARY_LENGTH);
        });
      }
    }
  };

  return handleAction(state, action, reducers);
};

export default occurrencesReducer;
