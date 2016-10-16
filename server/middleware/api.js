import buzz from './buzz';
import { EMIT_BUZZ, EMIT_BUZZ_RESPONSE } from 'ducks/devices';
import { BUZZ_RESPONSE } from 'constants';
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

      next(action);
      break;
    default:
      next(action);
      break;
  }
};
