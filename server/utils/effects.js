/* globals setInterval, clearInterval, setTimeout */
import { getPositions } from './devices';
import { BLACK, RESET_DESK_LIGHT_STRIP_TIMEOUT } from 'constants';

const random = (cap) => Math.floor(Math.random() * (cap - 1)) + 1;

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
    const UP = 'UP';
    const DOWN = 'DOWN';
    const rgbBiases = [ 'RED', 'BLUE' ];
    const generateColor = (r, g, b) => `rgb(${r}, ${0}, ${b})`;
    const generateRGBBias = () => rgbBiases[random(rgbBiases.length + 1) - 1];
    const createDrop = () => ({
      color: generateColor(0, 0, 0),
      rgbBias: generateRGBBias(),
      intensity: random(255),
      position: random(stripLength),
      direction: UP
    });
    const FPS = 90;
    const positions = getPositions(stripLength);

    const drops = [];

    for (let i of Array(10).keys()) { // eslint-disable-line no-unused-vars, prefer-const
      drops.push(createDrop(stripLength));
    }

    this.interval = setInterval(() => {
      strip.show();

      drops.forEach((drop, index) => {
        strip.pixel(positions[drop.position]).color(drop.color);

        if (drop.direction === UP) {
          drop.intensity = drop.intensity + 6;
        } else if (drop.direction === DOWN) {
          drop.intensity = drop.intensity - 6;
        }

        if (drop.intensity >= 255) {
          drop.direction = DOWN;
        } else if (drop.intensity <= 0) {
          drop.direction = UP;
          drop.position = random(stripLength);
          drop.rgbBias = generateRGBBias();
        }

        const tunedDown = Math.max(drop.intensity - 50, 0);
        if (drop.rgbBiases === RED) {
          drop.color = generateColor(drop.intensity, tunedDown, tunedDown);
        } else if (drop.rgbBias === GREEN) {
          drop.color = generateColor(tunedDown, drop.intensity, tunedDown);
        } else if (drop.rgbBias === BLUE) {
          drop.color = generateColor(tunedDown, tunedDown, drop.intensity);
        }
      });

    }, 100 / FPS);
  },

  stop(strip) {
    strip.color(BLACK);
    clearInterval(this.interval);
  }
};

export const flashColor = (strip, color, callback) => {
  strip.color(color);
  strip.show();

  setTimeout(() => {
    strip.color(BLACK);
    strip.show();

    callback();
  }, RESET_DESK_LIGHT_STRIP_TIMEOUT);
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
