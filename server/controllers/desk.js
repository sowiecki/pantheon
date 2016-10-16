import five from 'johnny-five';
import pixel from 'node-pixel';

import { EMIT_REGISTER_DESK_ACCESSORIES,
         EMIT_DESK_MIC_VALUE_CHANGE,
         EMIT_PC_ON,
         EMIT_SOUND_COM } from 'ducks/devices';
import { DESK_LIGHT_STRIP_PRIMARY,
         DESK_LIGHT_STRIP_PRIMARY_PIN,
         DESK_LIGHT_STRIP_PRIMARY_LENGTH,
         DESK_MIC_PRIMARY,
         DESK_MIC_PIN,
         DESK_PIEZO_PRIMARY,
         DESK_PIEZO_PIN } from 'constants';
import store from '../store';

export const deskController = (next) => ({
  initialize() {
    // const board = new five.Board({
    //   repl: false
    // });

    // board.on('fail', () => {
    //   throw new Error('Board connection failed');
    // });

    // board.on('ready', () => {
    //   const strip = new pixel.Strip({
    //     data: DESK_LIGHT_STRIP_PRIMARY_PIN,
    //     length: DESK_LIGHT_STRIP_PRIMARY_LENGTH,
    //     color_order: pixel.COLOR_ORDER.GRB,
    //     controller: 'FIRMATA',
    //     board
    //   });

    //   const mic = new five.Sensor(DESK_MIC_PIN);
    //   const piezo = new five.Piezo(DESK_PIEZO_PIN);

    //   store.dispatch({
    //     type: EMIT_REGISTER_DESK_ACCESSORIES,
    //     accessories: {
    //       [DESK_LIGHT_STRIP_PRIMARY]: strip,
    //       [DESK_MIC_PRIMARY]: mic,
    //       [DESK_PIEZO_PRIMARY]: piezo
    //     }
    //   });

    //   mic.on('ready', (value) => store.dispatch({
    //     type: EMIT_DESK_MIC_VALUE_CHANGE,
    //     value
    //   }));
    // });
  },

  pcOn() {
    store.dispatch({
      type: EMIT_PC_ON,
      next
    });
  },

  parseSoundCom({ speakers, com, target }) {
    store.dispatch({
      type: EMIT_SOUND_COM,
      speakers,
      com,
      target
    });
  }
});
