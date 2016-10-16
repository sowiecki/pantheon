import hue from 'node-hue-api';

import { EMIT_REGISTER_BRIDGE,
         EMIT_LR_LIGHT_ON,
         EMIT_LR_LIGHT_OFF,
         EMIT_DR_LIGHT_ON,
         EMIT_DR_LIGHT_OFF } from 'ducks/devices';
import store from '../store';

export const hueController = () => ({
  initialize() {
    hue.nupnpSearch().then(([bridge]) => {
      store.dispatch({
        type: EMIT_REGISTER_BRIDGE,
        bridge
      });
    }).done();
  },

  on() {
    store.dispatch({ type: EMIT_LR_LIGHT_ON });
  },

  off() {
    store.dispatch({ type: EMIT_LR_LIGHT_OFF });
  },

  parseCom({ loc, com }) {
    const type = `EMIT_${loc}_LIGHT_${com}`;

    store.dispatch({ type });
  }
});
