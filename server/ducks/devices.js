import { HueApi } from 'node-hue-api';

import { humanizeDuration } from 'utils';

export const FETCH_UNIFIED_ID = 'FETCH_UNIFIED_ID';
export const EMIT_REGISTER_UNIFIED_ID = 'EMIT_REGISTER_UNIFIED_ID';
export const EMIT_REGISTER_BRIDGE = 'EMIT_REGISTER_BRIDGE';
export const FETCH_SPOTIFY_TOKEN = 'FETCH_SPOTIFY_TOKEN';
export const EMIT_REGISTER_SPOTIFY_CLIENT = 'EMIT_REGISTER_SPOTIFY_CLIENT';
export const EMIT_REGISTER_SPOTIFY_TOKENS = 'EMIT_REGISTER_SPOTIFY_TOKENS';
export const EMIT_SPOTIFY_REFRESH_TOKEN_UPDATE = 'EMIT_SPOTIFY_REFRESH_TOKEN_UPDATE';
export const EMIT_REGISTER_SPOTIFY_PLAYER = 'EMIT_REGISTER_SPOTIFY_PLAYER';
export const EMIT_REGISTER_SPOTIFY_DEVICES = 'EMIT_REGISTER_SPOTIFY_DEVICES';

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

  [EMIT_REGISTER_UNIFIED_ID]: () => ({
    ...state,
    unifiedID: action.unifiedID
  }),

  [EMIT_REGISTER_SPOTIFY_CLIENT]: () => ({
    ...state,
    spotifyApi: action.spotifyApi
  }),

  [EMIT_REGISTER_SPOTIFY_TOKENS]: () => ({
    ...state,
    spotifyAccessToken: action.spotifyAccessToken,
    spotifyRefreshToken: action.spotifyRefreshToken || state.spotifyRefreshToken,
    spotifyTokenTimeLeft: humanizeDuration(action.spotifyTokenTimeLeft)
  }),

  [EMIT_REGISTER_SPOTIFY_PLAYER]: () => ({
    ...state,
    spotifyPlayer: action.data
  }),

  [EMIT_REGISTER_SPOTIFY_DEVICES]: () => ({
    ...state,
    spotifyDevices: action.data.devices
  })
});

export default devicesReducer;
