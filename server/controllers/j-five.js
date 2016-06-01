import five from 'johnny-five';
import pixel from 'node-pixel';

import { config } from '../environment';

// TODO maybe move this to devices reducer?
const board = new five.Board({ port: config.boards.jFive });

const jFiveController = {
  initialize() {
    const UP = 'UP';
    const DOWN = 'DOWN';
    const STRIP_LENGTH = 60;
    const positions = new Array(STRIP_LENGTH).fill(0).map((x, i) => i);

    let soundValue = 10;
    let fps = 120;
    let red = 100;
    let green = 0;
    let blue = 0;
    let blueDirection = UP;
    let redDirection = DOWN;
    let direction = UP;
    let valueToLight = 0;

    board.on('ready', () => {
      console.log(`Connected to ${board.id}`);

      const piezo = new five.Piezo(4);

      piezo.play({
        song: [
          ['C4', 1 / 4],
          ['D4', 1 / 4],
          ['F4', 1 / 4],
          ['D4', 1 / 4],
          ['A4', 1 / 4],
          [null, 1 / 4],
          ['A4', 1],
          ['G4', 1],
          [null, 1 / 2],
          ['C4', 1 / 4],
          ['D4', 1 / 4],
          ['F4', 1 / 4],
          ['D4', 1 / 4],
          ['G4', 1 / 4],
          [null, 1 / 4],
          ['G4', 1],
          ['F4', 1],
          [null, 1 / 2]
        ],
        tempo: 100
      });

      const strip = new pixel.Strip({
        data: 6,
        length: STRIP_LENGTH,
        color_order: pixel.COLOR_ORDER.GRB,
        board: board,
        controller: 'FIRMATA',
      });

      strip.on('ready', () => {
        setInterval(() => {
          strip.color('#000');

          if (blue >= 255) {
            blueDirection = DOWN;
          } else if (blue <= 0) {
            blueDirection = UP;
          }

          if (blueDirection === UP) {
            blue++;
          } else {
            blue--;
          }

          if (red >= 100) {
            redDirection = DOWN;
          } else if (red <= 0) {
            redDirection = UP;
          }

          if (redDirection === UP) {
            red++;
          } else {
            red--;
          }

          if (valueToLight >= STRIP_LENGTH - 1) {
            direction = DOWN;
          }

          if (valueToLight <= 0) {
            direction = UP;
          }

          if (direction === UP) {
            valueToLight++;
          } else {
            valueToLight--;
          }

          const color = `rgb(${red}, ${50}, ${blue})`;

          strip.pixel(positions[valueToLight]).color(color);
          strip.show();
        }, 1000 / fps);
      });
    });
  }
};
