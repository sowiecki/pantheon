import { get } from 'lodash';

import buzz from './buzz';
import pcOn from './pc-on';
import soundCom from './sound-com';
import fetchUnified from './fetch-unified';
import sendUnified from './send-unified';

import { sequences } from '../environment';
import { EMIT_BUZZ,
         EMIT_BUZZ_RESPONSE,
         EMIT_PC_ON,
         EMIT_PC_ON_RESPONSE,
         EMIT_SOUND_COM,
         EMIT_SOUND_COM_RESPONSE } from 'ducks/devices';
import { FETCH_UNIFIED_ID,
         SEND_UNIFIED_COMMAND,
         BATCH_UNIFIED_COMMANDS } from 'ducks/unified';
import { sleep } from 'utils';
import { BUZZ_RESPONSE, PC_ON_RESPONSE, SOUND_COM_RESPONSE } from 'constants';
import { proxyController } from 'controllers/proxy';

export default () => (next) => (action) => {
  switch (action.type) {
    case EMIT_BUZZ:
      buzz(action, next);

      break;
    case EMIT_BUZZ_RESPONSE:
      proxyController().send({
        BUZZ_RESPONSE,
        payload: {
          status: 200
        }
      });

      break;
    case EMIT_PC_ON:
      pcOn(action, next);

      break;
    case EMIT_PC_ON_RESPONSE:
      proxyController().send({
        PC_ON_RESPONSE,
        payload: {
          status: 200
        }
      });

      break;
    case EMIT_SOUND_COM:
      soundCom(action, next);

      break;
    case EMIT_SOUND_COM_RESPONSE:
      proxyController().send({
        SOUND_COM_RESPONSE,
        payload: {
          status: 200
        }
      });

      break;

    case FETCH_UNIFIED_ID:
      fetchUnified(action, next);

      break;

    case SEND_UNIFIED_COMMAND:
      sendUnified(action, next);

      break;

    case BATCH_UNIFIED_COMMANDS:
      const { body } = action;

      const batchCommands = async() => {
        const commands = body.predefined ? sequences[body.sequenceKey] : body.commands;

        for (const command of commands) {
          const duplicate = get(command, 'duplicate', 1);

          for (let i = 0; i < duplicate; i++) {
            await sleep(command.delay);
            await sendUnified(command, action, next);
          }
        }
      };

      batchCommands();

      break;
  }

  next(action);
};
