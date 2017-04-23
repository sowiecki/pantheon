import { HueApi } from 'node-hue-api';

export const FETCH_UNIFIED_ID = 'FETCH_UNIFIED_ID';
export const EMIT_REGISTER_UNIFIED_ID = 'EMIT_REGISTER_UNIFIED_ID';
export const EMIT_REGISTER_BRIDGE = 'EMIT_REGISTER_BRIDGE';
export const FETCH_SPOTIFY_CODE = 'FETCH_SPOTIFY_CODE';
export const EMIT_REGISTER_SPOTIFY_CLIENT = 'EMIT_REGISTER_SPOTIFY_CLIENT';
export const EMIT_REGISTER_SPOTIFY_TOKENS = 'EMIT_REGISTER_SPOTIFY_TOKENS';
export const EMIT_REFRESH_SPOTIFY_CODE = 'EMIT_REFRESH_SPOTIFY_CODE';

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
    spotifyRefreshToken: action.spotifyRefreshToken
  })
});

export default devicesReducer;
