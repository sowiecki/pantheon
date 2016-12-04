import store from '../store';
import { FETCH_UNIFIED_ID } from 'ducks/unified';

export const unifiedController = (next) => ({
  initialize() {
    store.dispatch({
      type: FETCH_UNIFIED_ID,
      next
    });
  }
});
