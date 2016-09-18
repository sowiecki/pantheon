import { EMIT_BUZZ } from 'ducks/devices';
import store from '../store';

export const buzzerController = (next) => ({
  buzz() {
    store.dispatch({
      type: EMIT_BUZZ,
      next
    });
  }
});
