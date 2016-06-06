/* globals setInterval, clearInterval, setTimeout */
import { getPositions } from './devices';
import { BLACK, RED } from '../constants';

export const cylonEye = {
  start(strip, stripLength) {
    const FPS = 120;
    const UP = 'UP';
    const DOWN = 'DOWN';
    const positions = getPositions(stripLength);

    let red = 100;
    let blue = 0;
    let blueDirection = UP;
    let redDirection = DOWN;
    let direction = UP;
    let valueToLight = 0;

    this.interval = setInterval(() => {
      strip.color(BLACK);

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

      if (valueToLight >= stripLength - 1) {
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
    }, 1000 / FPS);
  },

  stop(strip) {
    strip.color(BLACK);
    clearInterval(this.interval);
  }
};

export const unauthorizedFlash = (strip) => {
  strip.color(RED);
  strip.show();

  setTimeout(() => {
    strip.color(BLACK);
    strip.show();
  }, 1000);
};

export const sing = (piezo) => piezo.play({
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
