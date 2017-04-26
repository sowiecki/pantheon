/* eslint no-eval:0 */
import { get } from 'lodash';

import { ENV } from 'config';
import { CUSTOM_LIGHT_FUNCTIONS } from 'constants';
import {
  toggleLight,
  logUndefinedHandler,
  errorLightStatus
} from 'utils';

export const EMIT_QUEUE_EVENT = 'EMIT_QUEUE_EVENT';
export const EMIT_RESOLVE_QUEUED_EVENTS = 'EMIT_RESOLVE_QUEUED_EVENTS';
export const EMIT_SEND_HUE_COMMAND = 'EMIT_SEND_HUE_COMMAND';
export const EMIT_TRIGGER_PHOTON_FUNCTION = 'EMIT_TRIGGER_PHOTON_FUNCTION';
export const EMIT_FORWARD_HTTP_REQUEST = 'EMIT_FORWARD_HTTP_REQUEST';
export const EMIT_SEND_UNIFIED_COMMAND = 'EMIT_SEND_UNIFIED_COMMAND';
export const EMIT_CUSTOM_STATE_UPDATE = 'EMIT_CUSTOM_STATE_UPDATE';
export const EMIT_SEND_SPOTIFY_COMMAND = 'EMIT_SEND_SPOTIFY_COMMAND';

// Spotify onSuccess types
export const EMIT_REGISTER_SPOTIFY_PLAYER = 'EMIT_REGISTER_SPOTIFY_PLAYER';
export const EMIT_REGISTER_SPOTIFY_DEVICES = 'EMIT_REGISTER_SPOTIFY_DEVICES';
export const EMIT_SPOTIFY_PLAYLISTS_UPDATE = 'EMIT_SPOTIFY_PLAYLISTS_UPDATE';

const occurrencesReducer = (state, action) => ({
  [EMIT_SEND_HUE_COMMAND]() {
    const { hue } = state;
    const ipaddress = action.ipaddress || Object.keys(hue.userIDs)[0];
    const hueBridge = get(hue, `['${ipaddress}'].bridge`);

    if (CUSTOM_LIGHT_FUNCTIONS.includes(action.func)) {
      switch (action.func) {
        case 'toggle':
          toggleLight(hueBridge, state, action.id);
          break;
        default:
          errorLightStatus();
          break;
      }
    } else {
      try {
        const newLightState = state.lightState.create()[action.func](action.arg);

        hueBridge.setLightState(action.id, newLightState);
      } catch (e) {
        errorLightStatus();
      }
    }

    return { ...state };
  },

  [EMIT_CUSTOM_STATE_UPDATE]() {
    // Some services make it difficult to send non-stringified stateUpdates
    const mustBeParsed = typeof action.stateUpdates === 'string';
    const stateUpdates = mustBeParsed ? JSON.parse(action.stateUpdates) : action.stateUpdates;

    Object.keys(stateUpdates).forEach((customStateKey) => {
      try {
        const handler = get(ENV, `${action.path}.$state[${customStateKey}].$handler`);
        const customStateHandler = eval(handler);
        const value = stateUpdates[customStateKey] || customStateKey;

        state[customStateKey] = customStateHandler(value);
      } catch (e) {
        logUndefinedHandler(e);
      }
    });

    return { ...state };
  },

  [EMIT_QUEUE_EVENT]: () => ({
    ...state,
    queuedEvents: state.queuedEvents.concat(action.event)
  }),

  [EMIT_RESOLVE_QUEUED_EVENTS]: () => ({
    ...state,
    queuedEvents: action.queuedEvents
  }),

  [EMIT_REGISTER_SPOTIFY_PLAYER]: () => ({
    ...state,
    spotifyPlayer: action.data
  }),

  [EMIT_REGISTER_SPOTIFY_DEVICES]: () => ({
    ...state,
    spotifyDevices: action.data.devices
  }),

  [EMIT_SPOTIFY_PLAYLISTS_UPDATE]: () => ({
    ...state,
    spotifyPlaylists: action.data.items
  })
});

export default occurrencesReducer;
