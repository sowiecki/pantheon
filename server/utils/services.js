/* eslint no-console:0 */
import { set, get } from 'lodash';

/**
 * Safetly sets HTTP response, if possible.
 */
export const setResponse = (action, code) => set(action, 'next.body', code);

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const batchEvents = async (store, events) => {
  if (!events.length) {
    console.log('Unable to parse events');
  }

  for (const event of events) {
    const duplicate = get(event, 'duplicate', 1);

    for (let i = 0; i < duplicate; i++) {
      await sleep(event.delay);
      await store.dispatch(event);
    }
  }
};
