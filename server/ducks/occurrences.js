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

export const EMIT_LR_LIGHT_ON = 'EMIT_LR_LIGHT_ON';
export const EMIT_LR_LIGHT_OFF = 'EMIT_LR_LIGHT_OFF';
export const EMIT_LR_LIGHT_TOGGLE = 'EMIT_LR_LIGHT_TOGGLE';
export const EMIT_LR_LIGHT_SOFT = 'EMIT_LR_LIGHT_SOFT';
export const EMIT_DR_LIGHT_ON = 'EMIT_DR_LIGHT_ON';
export const EMIT_DR_LIGHT_OFF = 'EMIT_DR_LIGHT_OFF';
export const EMIT_DR_LIGHT_TOGGLE = 'EMIT_DR_LIGHT_TOGGLE';

export const EMIT_DESK_LIGHT_COLOR_FLASH = 'EMIT_DESK_LIGHT_COLOR_FLASH';
export const EMIT_DESK_MIC_VALUE_CHANGE = 'EMIT_MIC_VALUE_CHANGE';
export const EMIT_BUZZ = 'EMIT_BUZZ';
export const EMIT_BUZZ_RESPONSE = 'EMIT_BUZZ_RESPONSE';

export const EMIT_PC_ON = 'EMIT_PC_ON';
export const EMIT_PC_RESPONSE = 'EMIT_PC_RESPONSE';

export const EMIT_SOUND_COM = 'EMIT_SOUND_COM';
export const EMIT_SOUND_COM_RESPONSE = 'EMIT_SOUND_COM_RESPONSE';

export const EMIT_DEADBOLT_TOGGLE = 'EMIT_DEADBOLT_TOGGLE';
export const EMIT_SEND_UNIFIED_COMMAND = 'EMIT_SEND_UNIFIED_COMMAND';


const initialState = {
  lightState,
  isDeadboltLocked: false,
  isDoorClosed: false
};

const occurrencesReducer = (state = initialState, action) => {
  const hueBridge = get(action, 'devicesReducer.hueBridge');

  const reducers = {
    [EMIT_DR_LIGHT_ON]() {
      hueBridge.setLightState(1, state.lightState.create().on());

      return state;
    },

    [EMIT_DR_LIGHT_OFF]() {
      hueBridge.setLightState(1, state.lightState.create().off());

      return state;
    },

    [EMIT_LR_LIGHT_ON]() {
      hueBridge.setLightState(2, state.lightState.create().on());
      hueBridge.setLightState(2, state.lightState.create().bri(255));

      return state;
    },

    [EMIT_LR_LIGHT_OFF]() {
      hueBridge.setLightState(2, state.lightState.create().off());

      return state;
    },

    [EMIT_LR_LIGHT_SOFT]() {
      hueBridge.setLightState(2, state.lightState.create().on());
      hueBridge.setLightState(2, state.lightState.create().bri(100));

      return state;
    },

    [EMIT_DR_LIGHT_TOGGLE]() {
      toggleLights(hueBridge, state, 1);
    },

    [EMIT_LR_LIGHT_TOGGLE]() {
      toggleLights(hueBridge, state, 2);
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
