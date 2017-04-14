import { SINGLE_EVENT, BATCH_EVENTS, BATCH_EVENTS_FROM_WEBHOOK } from 'constants';
import store from 'store';
import { batchEvents, handleEvent } from 'utils';

const getEventHandlers = (payload) => ({
  [SINGLE_EVENT]() {
    handleEvent(store, payload.body);
  },

  [BATCH_EVENTS]() {
    batchEvents(store, payload.body);
  },

  /**
   * Workaround due to Particle Photon webhooks poor support of custom request bodies
   */
  [BATCH_EVENTS_FROM_WEBHOOK]() {
    batchEvents(store, JSON.parse(payload.headers.webhookbody));
  }
});

export default getEventHandlers;
