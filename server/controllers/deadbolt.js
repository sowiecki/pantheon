import five from 'johnny-five';
import Particle from 'particle-io';
import { get } from 'lodash';

import { EMIT_REGISTER_DEADBOLT_ACCESSORIES,
         EMIT_DEADBOLT_SENSOR_CHANGE,
         EMIT_DEADBOLT_PUSH_BUTTON_PRESS } from '../ducks/devices';
import { DEADBOLT_SENSOR_BUTTON_PIN,
         DEADBOLT_PUSH_BUTTON_PIN,
         DEADBOLT_LED_PIN,
         DEADBOLT_SENSOR_BUTTON,
         DEADBOLT_PUSH_BUTTON,
         DEADBOLT_LED } from '../constants';
import { config } from '../environment';
import store from '../store';

export const deadboltController = (next) => ({
  initialize() {
    const board = new five.Board({
      io: new Particle(config.photons.deadbolt),
      repl: false
    });

    board.on('ready', () => {
      const sensor = new five.Sensor.Digital(DEADBOLT_SENSOR_BUTTON_PIN);
      const deadboltButton = new five.Pin({
        pin: DEADBOLT_PUSH_BUTTON_PIN,
        mode: 1
      });
      const led = new five.Led(DEADBOLT_LED_PIN);

      store.dispatch({
        type: EMIT_REGISTER_DEADBOLT_ACCESSORIES,
        accessories: {
          [DEADBOLT_SENSOR_BUTTON]: sensor,
          [DEADBOLT_PUSH_BUTTON]: deadboltButton,
          [DEADBOLT_LED]: led
        }
      });

      sensor.on('change', () => {
        store.dispatch({
          type: EMIT_DEADBOLT_SENSOR_CHANGE,
          value: sensor.value
        });
      });
    });
  },

  toggle(id = get(next, 'request.header.id')) {
    store.dispatch({
      type: EMIT_DEADBOLT_PUSH_BUTTON_PRESS,
      passcode: id,
      next
    });
  }
});
