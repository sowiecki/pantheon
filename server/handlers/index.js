import { BUZZ, BUZZ_EVENTS, BATCH_EVENTS } from 'constants';
import { batchEvents } from 'utils';

import store from '../store';

const getStandardHandlers = (payload) => ({
  /**
   * Special snowflake handler for Particle Photon buzzer, because holy-fucking-shit
   * their webhooks don't support custom request bodies
   */
  [BUZZ]() {
    batchEvents(store, BUZZ_EVENTS);
  },

  [BATCH_EVENTS]() {
    batchEvents(store, payload.body);
  }
});

export default getStandardHandlers;
