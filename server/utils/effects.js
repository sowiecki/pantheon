import { getPositions } from './devices';

export const cylonEye = (strip, stripLength) => {
  const FPS = 120;
  const UP = 'UP';
  const DOWN = 'DOWN';
  const positions = getPositions(stripLength);

  let red = 100;
  let green = 0;
  let blue = 0;
  let blueDirection = UP;
  let redDirection = DOWN;
  let direction = UP;
  let valueToLight = 0;

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
};
