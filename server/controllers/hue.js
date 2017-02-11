import hue from 'node-hue-api';

import { config } from 'environment';

import { EMIT_REGISTER_BRIDGE } from 'ducks/devices';
import store from 'store';

const hueController = () => ({
  initialize() {
    if (!config.hueUserIDs) {
      return;
    }

    hue.nupnpSearch().then((bridges) => {
      bridges.map((bridge) => {
        const userID = config.hueUserIDs[bridge.ipaddress];

        if (!userID) {
          this.noUserIDFound(bridge);
        }

        return store.dispatch({
          type: EMIT_REGISTER_BRIDGE,
          bridge,
          userID
        });
      });
    }).done();
  },

  noUserIDFound(bridge) {
    throw new Error(`userID not found for Hue bridge on ${bridge.ipaddress}`);
  }
});

export default hueController;
