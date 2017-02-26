import hue from 'node-hue-api';

import { config } from 'environment';

import { EMIT_REGISTER_BRIDGE } from 'ducks/devices';
import { errorNoUserIDFound } from 'utils';
import store from 'store';
import Controller from './controller';

const hueController = new Controller({
  displayName: 'Hue Controller',

  shouldInit: () => !!config.hueUserIDs,

  initialize() {
    hue.nupnpSearch().then((bridges) => {
      bridges.map((bridge) => {
        const userID = config.hueUserIDs[bridge.ipaddress];

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
});

export default hueController;
