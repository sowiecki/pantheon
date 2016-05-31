import hue, { HueApi, lightState } from 'node-hue-api';

import { config } from '../environment';

// TODO wew
const userId = config.users[Object.keys(config.users)[0]];

// TODO move to Redux state
const state = {};
const l = lightState.create();
const api = () => new HueApi(state.bridge.ipaddress, userId);

export const hueController = {
  logBridges(bridge) {
    console.info(bridge);
  },

  initialize() {
    hue.nupnpSearch().then(([bridge]) => {
      state.bridge = bridge;
    }).done();
  },

  on() {
    api().setLightState(2, l.on());
  },

  off() {
    api().setLightState(2, l.off());
  }
};
