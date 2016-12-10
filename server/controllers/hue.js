import hue from 'node-hue-api';

import { EMIT_REGISTER_BRIDGE } from 'ducks/devices';
import store from '../store';

const hueController = () => ({
  initialize() {
    hue.nupnpSearch().then(([bridge]) => {
      store.dispatch({
        type: EMIT_REGISTER_BRIDGE,
        bridge
      });
    }).done();
  },

  parseCom({ loc, com }) {
    const type = `EMIT_${loc}_LIGHT_${com}`;

    store.dispatch({ type });
  }
});

export default hueController;
