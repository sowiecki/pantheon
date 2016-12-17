import { BATCH_EVENTS } from 'constants';
import { batchEvents } from 'utils';

import store from '../store';

const getStandardHandlers = (payload) => ({
  [BATCH_EVENTS]() {
    batchEvents(store, payload.body);
  }
});

export default getStandardHandlers;
