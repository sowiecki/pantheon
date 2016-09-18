/* globals setInterval, clearInterval, setTimeout */
import { map } from 'lodash';

import { getPositions } from './devices';
import { BLACK, RED } from '../constants';

export const cylonEye = {
  start(strip, stripLength) {
    const FPS = 160;
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

      const color = `rgb(${red}, ${0}, ${blue})`;

      strip.pixel(positions[valueToLight]).color(color);
      strip.show();
    }, 1000 / FPS);
  },

  stop(strip) {
    strip.color(BLACK);
    clearInterval(this.interval);
  }
};

export const rain = {
  start(strip, stripLength) {
    const random = () => Math.floor(Math.random() * 60) + 1;
    const positionsToLight = new Array(10).fill().map(() => ({ intensity: random(), position: random() }));

    this.interval = setInterval(() => {
      strip.color(BLACK);

      map(positionsToLight, (positionToLight) => {
        strip.pixel(positionToLight).color(rgb(50, 50, 255));
        strip.show();

        positionToLight.intensity = positionToLight.intensity - 1;

        return positionToLight;
      });
    });
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

export const buzz = (piezo) => piezo.play({
  song: [
    ['C4', 1],
    [null, 1],
    ['D4', 1],
    [null, 1],
    ['C4', 1]
  ],
  tempo: 1000
});

export const doot = (piezo) => piezo.play({
  song: [
    ['C4', 1],
    [null, 1],
    ['D4', 1],
    [null, 1],
    ['C4', 1]
  ],
  tempo: 1000
});
