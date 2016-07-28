import { EMIT_BUZZ } from '../ducks/devices';
import store from '../store';

export const buzzerController = {
  initialize() {

  },

  buzz() {
    store.dispatch({ type: EMIT_BUZZ });
  }
};
