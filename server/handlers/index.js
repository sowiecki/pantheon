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
    const data = payload.headers.webhookbody.replace('//', '/');
    const parsedData = JSON.parse(data);

    if (typeof parsedData === 'string') {
      console.log(JSON.parse(parsedData))
      // Parse again, because the C++ library wrapped in a second set of quotes
      batchEvents(store, JSON.parse(parsedData));
    } else {
      batchEvents(store, parsedData);
    }
  }
});

export default getEventHandlers;
