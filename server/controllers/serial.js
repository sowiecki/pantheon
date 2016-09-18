import { parsers, SerialPort } from 'serialport';

import { config } from 'environment';
import { EMIT_SERIAL_DATA_CHANGE } from 'ducks/devices';
import store from '../store';

const serial = new SerialPort(config.ports.serial, {
  baudrate: 9600,
  parser: parsers.readline('\n')
});

export const serialController = () => ({
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
});
