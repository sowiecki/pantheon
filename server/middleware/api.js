
import { FETCH_UNIFIED_ID } from 'ducks/devices';
import { EMIT_BUZZ,
         EMIT_BUZZ_RESPONSE,
         EMIT_PC_ON,
         EMIT_PC_ON_RESPONSE,
         EMIT_SOUND_COM,
         EMIT_SOUND_COM_RESPONSE,
         EMIT_SEND_UNIFIED_COMMAND } from 'ducks/occurrences';
import { handleAction } from 'utils';
import { BUZZ_RESPONSE, PC_ON_RESPONSE, SOUND_COM_RESPONSE } from 'constants';
import { proxyController } from 'controllers';

import buzz from './buzz';
import pcOn from './pc-on';
import soundCom from './sound-com';
import fetchUnified from './fetch-unified';
import sendUnified from './send-unified';

export default (store) => (next) => (action) => {
  const reducers = {
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

    [EMIT_PC_ON]() {
      pcOn(action, next);
    },

    [EMIT_PC_ON_RESPONSE]() {
      proxyController().send({
        PC_ON_RESPONSE,
        payload: {
          status: 200
        }
      });
    },

    [EMIT_SOUND_COM]() {
      soundCom(action, next);
    },

    [EMIT_SOUND_COM_RESPONSE]() {
      proxyController().send({
        SOUND_COM_RESPONSE,
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
