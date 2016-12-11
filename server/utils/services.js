import { get } from 'lodash';

/**
 * Safetly sets HTTP response, if possible.
 * TODO: Send response to webSocket proxy when possible.
 */
export const setResponse = (action, code) => {
  if (action && action.next) {
    action.next.body = code;
  }
};

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const batchEvents = async (store, events) => {
  if (!events.length) {
    throw new Error('Unable to parse events');
  }

  for (const event of events) {
    const duplicate = get(event, 'duplicate', 1);

    for (let i = 0; i < duplicate; i++) {
      await sleep(event.delay);
      await store.dispatch({
        ...event,
        devicesReducer: store.getState().devicesReducer
      });
    }
  }
};
