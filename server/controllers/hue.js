import hue from 'node-hue-api';

import { config } from 'environment';

import { EMIT_REGISTER_BRIDGE } from 'ducks/devices';
import store from 'store';

const hueController = () => ({
  initialize() {
    if (!config.hue) {
      return;
    }

    hue.nupnpSearch().then(([bridge]) => {
      store.dispatch({
        type: EMIT_REGISTER_BRIDGE,
        bridge
      });
    }).done();
  }
});

export default hueController;
