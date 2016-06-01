import five from 'johnny-five';
import pixel from 'node-pixel';

import { config } from '../environment';
import { cylonEye } from '../utils';

export const jFiveController = {
  initialize() {
    // TODO maybe move this to devices reducer?
    const board = new five.Board({
      port: config.boards.jFive,
      repl: false
    });

    const STRIP_LENGTH = 60;

    board.on('ready', () => {
      const strip = new pixel.Strip({
        data: 6,
        length: STRIP_LENGTH,
        color_order: pixel.COLOR_ORDER.GRB,
        board: board,
        controller: 'FIRMATA',
      });

      strip.on('ready', () => {
        cylonEye.start(strip, STRIP_LENGTH);
      });
    });
  }
};
