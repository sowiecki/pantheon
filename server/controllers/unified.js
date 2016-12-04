import store from '../store';
import { FETCH_UNIFIED_ID, SEND_UNIFIED_COMMAND } from 'ducks/unified';

export const unifiedController = (next) => ({
  initialize() {
    store.dispatch({
      type: FETCH_UNIFIED_ID,
      next
    });
  },

  command() {
    store.dispatch({
      type: SEND_UNIFIED_COMMAND,
      next
    });
  }
});
