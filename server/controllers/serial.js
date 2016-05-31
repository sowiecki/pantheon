import serialport, { SerialPort } from 'serialport';

import { EMIT_SERIAL_DATA_CHANGE } from '../ducks/devices';
import store from '../store';

const serial = new SerialPort('/dev/cu.usbmodem1421', {
  baudrate: 9600,
  parser: serialport.parsers.readline('\n')
});

export const serialController = {
  initialize() {
    serial.on('open', () => {
      serial.on('data', (data) => {
        store.dispatch({
          type: EMIT_SERIAL_DATA_CHANGE,
          data
        });
      });
    });
  }
};
