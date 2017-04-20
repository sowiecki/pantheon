import https from 'https';
import { HueApi } from 'node-hue-api';

export const FETCH_UNIFIED_ID = 'FETCH_UNIFIED_ID';
export const EMIT_REGISTER_UNIFIED_ID = 'EMIT_REGISTER_UNIFIED_ID';
export const EMIT_REGISTER_BRIDGE = 'EMIT_REGISTER_BRIDGE';
export const EMIT_REGISTER_SPOTIFY_CLIENT = 'EMIT_REGISTER_SPOTIFY_CLIENT';
export const EMIT_REGISTER_SPOTIFY_CODE = 'EMIT_REGISTER_SPOTIFY_CODE';
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

  [EMIT_REGISTER_SPOTIFY_CODE]() {
    // TODO extract and clean up! And use to always register spotify devices
    const foo = (token) => https.get({
      host: 'api.spotify.com',
      path: '/v1/me/player/devices',
      headers: {
        Authorization: `Bearer ${token}`
      }
    }, (res) => {
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
      });
      res.on('end', () => {
        console.log('No more data in response.');
      });
    });

    const bar = (token) => https.request({
      method: 'PUT',
      host: 'api.spotify.com',
      path: '/v1/me/player/play',
      headers: {
        Authorization: `Bearer ${token}`
      }
    }, (res) => {
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
      });
      res.on('end', () => {
        console.log('No more data in response.');
      });
    });

    state.spotifyApi.authorizationCodeGrant(action.code).then(({ body }) => {
      state.spotifyApi.setAccessToken(body.access_token);
      state.spotifyApi.setRefreshToken(body.refresh_token);
      // foo(body.access_token);
      // const req = bar(body.access_token); // TODO working Spotify play! Yay! Extract to cleaner/programmatic setup
      // req.end();
    }, (err) => {
      console.log('Problem setting Spotify authentication code!', err); // eslint-disable-line
    });

    return {
      ...state,
      spotifyToken: action.code
    };
  },

  [EMIT_REFRESH_SPOTIFY_CODE]() {
    state.spotifyApi.refreshAccessToken();

    return {
      ...state
    };
  }
});

export default devicesReducer;
