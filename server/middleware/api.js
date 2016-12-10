import { get } from 'lodash';

import { EMIT_BUZZ,
         EMIT_BUZZ_RESPONSE,
         EMIT_PC_ON,
         EMIT_PC_ON_RESPONSE,
         EMIT_SOUND_COM,
         EMIT_SOUND_COM_RESPONSE,
         FETCH_UNIFIED_ID,
         SEND_UNIFIED_COMMAND,
         BATCH_UNIFIED_COMMANDS } from 'ducks/devices';
import { sleep, handleAction } from 'utils';
import { BUZZ_RESPONSE, PC_ON_RESPONSE, SOUND_COM_RESPONSE } from 'constants';
import { proxyController } from 'controllers';

import buzz from './buzz';
import pcOn from './pc-on';
import soundCom from './sound-com';
import fetchUnified from './fetch-unified';
import sendUnified from './send-unified';

export default (state) => (next) => (action) => {
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

    [SEND_UNIFIED_COMMAND]() {
      sendUnified(action, next);
    },

    [BATCH_UNIFIED_COMMANDS]() {
      const { commands } = action;

      const batchCommands = async () => {
        for (const command of commands) {
          const duplicate = get(command, 'duplicate', 1);

          for (let i = 0; i < duplicate; i++) {
            await sleep(command.delay);
            await sendUnified(command, next);
          }
        }
      };

      batchCommands();
    }
  };

  handleAction(state, action, reducers);

  next(action);
};
