import { reduce } from 'lodash';

/**
 * @param {object} state
 * @param {object} action
 * @param {object} reducers
 * @returns {object} newState - Returns new state clone if modified by reducer,
 *                              else returns original, unmutated state object.
 */
export const handleAction = (state, action, reducers) => {
  const newState = reducers[action.type] ? reducers[action.type]() : state;

  return newState || state;
};

export const toggleLights = (hueBridge, state, light) => {
  hueBridge.lightStatus(light).then((lightResult) => {
    if (lightResult.state.on) {
      hueBridge.setLightState(light, state.lightState.create().off());
    } else {
      hueBridge.setLightState(light, state.lightState.create().on());
      hueBridge.setLightState(light, state.lightState.create().bri(255));
    }
  });
};

/**
 * @param {object} events - User defined events (limited to predefined types)
 * @returns {object} - Flattened custom state
 */
export const formatCustomState = (events) => {
  if (!events) {
    return;
  }

  const eventKeys = Object.keys(events);
  const customStates = eventKeys.map((eventKey) => events[eventKey].$state).filter((e) => !!e);

  return reduce(customStates, (a, b) => ({ ...a, ...b }));
};
