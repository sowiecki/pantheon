/* eslint no-console:0 */
import { set, get, isEmpty, mapKeys, camelCase } from 'lodash';

import { EMIT_QUEUE_EVENT, RESOLVE_CUSTOM_STATE_UPDATE } from 'ducks/occurrences';

/**
 * Safetly sets HTTP response, if possible.
 */
export const setResponse = (action, code) => set(action, 'next.body', code);

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const handleEvent = async (store, event) => {
  if (!isEmpty(event.conditions)) {
    await store.dispatch({
      type: EMIT_QUEUE_EVENT,
      event,
    });
  } else {
    const repeat = get(event, 'repeat', 1);

    for (let i = 0; i < repeat; i++) {
      await sleep(event.delay);
      await store.dispatch(event);
    }

    // The state needs to be rechecked to see if any queued event's conditions have been met
    await store.dispatch({ type: RESOLVE_CUSTOM_STATE_UPDATE });
  }
};

export const batchEvents = async (store, events) => {
  if (!events.length) {
    console.log('Unable to parse events');
  }

  for (const event of events) {
    const duplicate = get(event, 'duplicate', 1);

    for (let i = 0; i < duplicate; i++) {
      handleEvent(store, event);
    }
  }
};

export const getHueStates = async (store) => {
  const state = store.getState().meta;
  const ipaddresses = Object.keys(state.hue).slice(1);
  const lightStates = {};

  for (let i = 0; i < ipaddresses.length; i++) {
    const ipaddress = ipaddresses[i];
    const { bridge } = state.hue[ipaddress];

    await bridge.groups().then((result) => {
      lightStates[ipaddress] = result;
    });
  }

  return lightStates;
};

export const formatRequestKeys = (command) => (action, state) => {
  const formattedAction = mapKeys(action, (value, key) => camelCase(key));
  return command(formattedAction, state);
};
