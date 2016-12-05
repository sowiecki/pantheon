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


export const handleEvent = (event, handlers) => {
  const handler = handlers[event] || handlers[undefined];

  handler();
};

export const toggleLights = (state, light) => {
  state.hueBridge.lightStatus(light).then((lightResult) => {
    if (lightResult.state.on) {
      state.hueBridge.setLightState(light, state.lightState.create().off());
    } else {
      state.hueBridge.setLightState(light, state.lightState.create().on());
      state.hueBridge.setLightState(light, state.lightState.create().bri(255));
    }
  });
};
