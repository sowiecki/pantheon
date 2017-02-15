import { BATCH_EVENTS, BATCH_EVENTS_FROM_WEBHOOK } from 'constants';
import store from 'store';
import { batchEvents } from 'utils';

const getEventHandlers = (payload) => ({
  [BATCH_EVENTS]() {
    batchEvents(store, payload.body);
  },

  /**
   * Workaround due to Particle Photon webhooks not supporting request bodies
   */
  [BATCH_EVENTS_FROM_WEBHOOK]() {
    batchEvents(store, JSON.parse(payload.headers.webhookbody));
  }
});

export default getEventHandlers;
