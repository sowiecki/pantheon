import { FETCH_UNIFIED_ID, FETCH_SPOTIFY_CODE } from 'ducks/devices';
import {
  RESOLVE_CUSTOM_STATE_UPDATE,
  EMIT_QUEUE_EVENT,
  EMIT_TRIGGER_PHOTON_FUNCTION,
  EMIT_FORWARD_HTTP_REQUEST,
  EMIT_SEND_UNIFIED_COMMAND,
  EMIT_REGISTER_SPOTIFY_CLIENT,
  EMIT_REFRESH_SPOTIFY_CODE,
  EMIT_SEND_SPOTIFY_COMMAND
} from 'ducks/occurrences';
import { handleAction } from 'utils';

import resolveQueuedEvents from './resolve-queued-events';
import triggerPhotonFunction from './trigger-photon-function';
import forwardHTTPRequest from './forward-http-request';
import fetchUnified from './fetch-unified';
import sendUnifiedCommand from './send-unified-command';
import fetchSpotifyCode from './fetch-spotify-code';
import sendSpotifyCommand from './send-spotify-command';

export default (store) => (next) => (action) => {
  const reducers = {
    [RESOLVE_CUSTOM_STATE_UPDATE]() {
      resolveQueuedEvents(action);
      // const waitForStateUpdate = () => resolveQueuedEvents(action);
      // setTimeout(waitForStateUpdate, 100);
    },

    [EMIT_QUEUE_EVENT]: () => {
      resolveQueuedEvents(action);
    },

    [EMIT_TRIGGER_PHOTON_FUNCTION]() {
      triggerPhotonFunction(action, next);
    },

    [EMIT_FORWARD_HTTP_REQUEST]() {
      forwardHTTPRequest(action, next);
    },

    [FETCH_UNIFIED_ID]() {
      fetchUnified(action, next);
    },

    [EMIT_SEND_UNIFIED_COMMAND]() {
      sendUnifiedCommand(store, action, next);
    },

    [EMIT_REGISTER_SPOTIFY_CLIENT]() {
      next({ type: FETCH_SPOTIFY_CODE, code: action.code });
    },

    [FETCH_SPOTIFY_CODE]() {
      fetchSpotifyCode(store, action, next);
    },

    [EMIT_REFRESH_SPOTIFY_CODE]() {
      store.getState().meta.spotifyApi.refreshAccessToken();
    },

    [EMIT_SEND_SPOTIFY_COMMAND]() {
      sendSpotifyCommand(store, action, next);
    }
  };

  handleAction(store, action, reducers);

  next(action);
};
