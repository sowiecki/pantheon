import { flatMap, map, reduce } from 'lodash';

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
 * @param {object} config - User configuration
 * @returns {object} - Flattened custom state
 */
export const initCustomState = (config) => {
  const customStates = flatMap(config, (property) => map(property, '$state')).filter((e) => e);

  return reduce(customStates, (result, value) => ({ ...result, ...value }));
};
