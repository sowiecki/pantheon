import { FETCH_UNIFIED_ID } from 'ducks/devices';
import { EMIT_TRIGGER_PHOTON_FUNCTION,
         EMIT_FORWARD_HTTP_REQUEST,
         EMIT_SEND_UNIFIED_COMMAND } from 'ducks/occurrences';
import { handleAction } from 'utils';

import triggerPhotonFunction from './trigger-photon-function';
import forwardHTTPRequest from './forward-http-request';
import fetchUnified from './fetch-unified';
import sendUnified from './send-unified';

export default (store) => (next) => (action) => {
  const reducers = {
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
      sendUnified(store, action, next);
    }
  };

  handleAction(store, action, reducers);

  next(action);
};
