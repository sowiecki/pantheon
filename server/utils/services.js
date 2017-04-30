/* eslint no-console:0 */
import { set, get, mapKeys, camelCase } from 'lodash';

/**
 * Safetly sets HTTP response, if possible.
 */
export const setResponse = (action, code) => set(action, 'next.body', code);

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const handleEvent = async (store, event) => {
  await sleep(event.delay);
  await store.dispatch(event);
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
    const bridge = state.hue[ipaddress].bridge;

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
