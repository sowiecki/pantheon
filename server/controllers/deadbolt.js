import five from 'johnny-five';
import Particle from 'particle-io';

import { EMIT_REGISTER_DEADBOLT_ACCESSORIES,
         EMIT_DEADBOLT_SENSOR_CHANGE,
         EMIT_DEADBOLT_PUSH_BUTTON_PRESS } from '../ducks/devices';
import { DEADBOLT_SENSOR_PIN,
         DEADBOLT_PUSH_BUTTON_PIN,
         DEADBOLT_LED_PIN,
         DEADBOLT_SENSOR,
         DEADBOLT_PUSH_BUTTON,
         DEADBOLT_LED } from '../constants';
import { config } from '../environment';
import store from '../store';

export const deadboltController = () => ({
  initialize() {
    const board = new five.Board({
      io: new Particle(config.photons.deadbolt),
      repl: false
    });

    board.on('ready', () => {
      const sensor = new five.Sensor(DEADBOLT_SENSOR_PIN);
      const nfcButton = new five.Button(DEADBOLT_PUSH_BUTTON_PIN);
      const led = new five.Led(DEADBOLT_LED_PIN);

      store.dispatch({
        type: EMIT_REGISTER_DEADBOLT_ACCESSORIES,
        accessories: {
          [DEADBOLT_SENSOR]: sensor,
          [DEADBOLT_PUSH_BUTTON]: nfcButton,
          [DEADBOLT_LED]: led
        }
      });

      sensor.on('change', () => {
        store.dispatch({
          type: EMIT_DEADBOLT_SENSOR_CHANGE
        });
      });

      nfcButton.on('press', () => {
        store.dispatch({
          type: EMIT_DEADBOLT_PUSH_BUTTON_PRESS
        });
      });
    });
  }
});
