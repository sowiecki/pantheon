import { EMIT_REGISTER_BOARD } from '../ducks/devices';
import store from '../store';

export const jFiveController = {
  initialize() {
    store.dispatch({ type: EMIT_REGISTER_BOARD });
  }
};
