import five from 'johnny-five';
import pixel from 'node-pixel';

import { EMIT_REGISTER_ACCESSORIES } from '../ducks/devices';
import { LIGHT_STRIP_PRIMARY,
         MIC_PIN,
         LIGHT_STRIP_PRIMARY_PIN,
         LIGHT_STRIP_PRIMARY_LENGTH } from '../constants';
import { config } from '../environment';
import store from '../store';

export const jFiveController = {
  initialize() {
    const board = new five.Board({
      port: config.ports.jFive,
      repl: false
    });

    board.on('ready', () => {
      const strip = new pixel.Strip({
        data: LIGHT_STRIP_PRIMARY_PIN,
        length: LIGHT_STRIP_PRIMARY_LENGTH,
        color_order: pixel.COLOR_ORDER.GRB,
        controller: 'FIRMATA',
        board
      });

      const mic = new five.Sensor(MIC_PIN);

      store.dispatch({
        type: EMIT_REGISTER_ACCESSORIES,
        accessories: [
          { [LIGHT_STRIP_PRIMARY]: strip },
          { [MIC_PRIMARY]: mic }
        ]
      });
    });
  }
};
