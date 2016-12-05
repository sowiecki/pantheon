import store from '../store';
import { FETCH_UNIFIED_ID, BATCH_UNIFIED_COMMANDS } from 'ducks/unified';
import { UNIFIED_KEEP_ALIVE_INTERVAL } from 'constants';

export const unifiedController = (next) => ({
  initialize() {
    const keepAlive = () => store.dispatch({
      type: FETCH_UNIFIED_ID,
      next
    });

    keepAlive();

    setInterval(keepAlive, UNIFIED_KEEP_ALIVE_INTERVAL);
  },

  batch(payload) {
    store.dispatch({
      type: BATCH_UNIFIED_COMMANDS,
      payload,
      next
    });
  }
});
