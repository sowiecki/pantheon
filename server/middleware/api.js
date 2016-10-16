import buzz from './buzz';
import pcOn from './pc-on';
import soundCom from './sound-com';

import { EMIT_BUZZ,
         EMIT_BUZZ_RESPONSE,
         EMIT_PC_ON,
         EMIT_PC_ON_RESPONSE,
         EMIT_SOUND_COM,
         EMIT_SOUND_COM_RESPONSE } from 'ducks/devices';
import { BUZZ_RESPONSE, PC_ON_RESPONSE, SOUND_COM_RESPONSE } from 'constants';
import { proxyController } from 'controllers/proxy';

export default () => (next) => (action) => {
  console.log(action)
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

      next(action);
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

      next(action);
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

      next(action);
      break;
    default:
      next(action);
      break;
  }
};
