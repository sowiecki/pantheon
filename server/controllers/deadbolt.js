import five from 'johnny-five';
import Particle from 'particle-io';

import { EMIT_REGISTER_DEADBOLT_ACCESSORIES,
         EMIT_DEADBOLT_PUSH_BUTTON_PRESS,
         EMIT_DEADBOLT_NFC_BUTTON_PRESS } from '../ducks/devices';
import { DEADBOLT_PUSH_BUTTON_PIN,
         DEADBOLT_NFC_BUTTON_PIN,
         DEADBOLT_LED_PIN,
         DEADBOLT_SERVO_PIN,
         DEADBOLT_PUSH_BUTTON,
         DEADBOLT_NFC_BUTTON,
         DEADBOLT_LED,
         DEADBOLT_SERVO } from '../constants';
import { config } from '../environment';
import store from '../store';

export const deadboltController = () => ({
  initialize() {
    const board = new five.Board({
      io: new Particle(config.photons.deadbolt),
      repl: false
    });

    board.on('ready', () => {
      const pushButton = new five.Button(DEADBOLT_PUSH_BUTTON_PIN);
      const nfcButton = new five.Button(DEADBOLT_NFC_BUTTON_PIN);
      const led = new five.Led(DEADBOLT_LED_PIN);
      const servo = new five.Servo({
        pin: DEADBOLT_SERVO_PIN,
        center: true
      });

      store.dispatch({
        type: EMIT_REGISTER_DEADBOLT_ACCESSORIES,
        accessories: {
          [DEADBOLT_PUSH_BUTTON]: pushButton,
          [DEADBOLT_NFC_BUTTON]: nfcButton,
          [DEADBOLT_LED]: led,
          [DEADBOLT_SERVO]: servo
        }
      });

      pushButton.on('press', () => {
        store.dispatch({
          type: EMIT_DEADBOLT_PUSH_BUTTON_PRESS
        });
      });

      nfcButton.on('press', () => {
        store.dispatch({
          type: EMIT_DEADBOLT_NFC_BUTTON_PRESS
        });
      });
    });
  }
});
