import hue from 'node-hue-api';

import { ENV } from 'config';
import { EMIT_REGISTER_BRIDGE } from 'ducks/devices';
import store from 'store';
import { errorNoUserIDFound } from 'utils';

const hueController = {
  displayName: 'Hue Controller',

  shouldInit: () => !!ENV.hueUserIDs,

  initialize() {
    hue.nupnpSearch().then((bridges) => {
      bridges.map((bridge) => {
        const userID = ENV.hueUserIDs[bridge.ipaddress];

        if (!userID) {
          return errorNoUserIDFound(bridge.ipaddress);
        }

        return store.dispatch({
          type: EMIT_REGISTER_BRIDGE,
          bridge,
          userID
        });
      });
    }).done();
  }
};

export default hueController;
