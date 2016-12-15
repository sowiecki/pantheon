import { FETCH_UNIFIED_ID } from 'ducks/devices';
import { EMIT_TRIGGER_PHOTON_FUNCTION,
         EMIT_BUZZ,
         EMIT_BUZZ_RESPONSE,
         EMIT_SEND_UNIFIED_COMMAND } from 'ducks/occurrences';
import { handleAction } from 'utils';
import { BUZZ_RESPONSE } from 'constants';
import { proxyController } from 'controllers';

import buzz from './buzz';

import triggerPhotonFunction from './trigger-photon-function';
import fetchUnified from './fetch-unified';
import sendUnified from './send-unified';

export default (store) => (next) => (action) => {
  const reducers = {
    [EMIT_TRIGGER_PHOTON_FUNCTION]() {
      triggerPhotonFunction(action, next);
    },

    [EMIT_BUZZ]() {
      buzz(action, next);
    },

    [EMIT_BUZZ_RESPONSE]() {
      proxyController().send({
        BUZZ_RESPONSE,
        payload: {
          status: 200
        }
      });
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
