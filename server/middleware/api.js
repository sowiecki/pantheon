import buzz from './buzz';
import { EMIT_BUZZ } from 'ducks/devices';

export default () => (next) => (action) => {
  switch (action.type) {
    case EMIT_BUZZ:
      buzz(action, next);
      break;
    default:
      next(action);
      break;
  }
};
