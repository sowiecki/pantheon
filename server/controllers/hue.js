import hue from 'node-hue-api';

import { EMIT_REGISTER_BRIDGE,
         EMIT_TURN_ON_LIGHT,
         EMIT_TURN_OFF_LIGHT } from '../ducks/devices';
import store from '../store';

export const hueController = {
  initialize() {
    hue.nupnpSearch().then(([bridge]) => {
      store.dispatch({
        type: EMIT_REGISTER_BRIDGE,
        bridge
      });
    }).done();
  },

  on() {
    store.dispatch({ type: EMIT_TURN_ON_LIGHT });
  },

  off() {
    store.dispatch({ type: EMIT_TURN_OFF_LIGHT });
  }
};
