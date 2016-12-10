const five = require('johnny-five');
const pixel = require('node-pixel');

const DESK_LIGHT_STRIP_PRIMARY_LENGTH = 60;
const DESK_LIGHT_STRIP_PRIMARY_PIN = 6;
const BLACK = 'rgb(0, 0, 0)';

const getPositions = (stripLength) => new Array(stripLength).fill(0).map((x, i) => i);

const SerialPort = require('serialport').SerialPort;

const board = new five.Board({
  port: new SerialPort('/dev/cu.usbmodem1421', {
    baudrate: 9600
  })
});

const rain = {
  start(strip, stripLength) {
    const FPS = 60;
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

board.on('ready', () => {
  const strip = new pixel.Strip({
    color_order: pixel.COLOR_ORDER.GRB,
    controller: 'FIRMATA',
    strips: [
      { pin: DESK_LIGHT_STRIP_PRIMARY_PIN, length: DESK_LIGHT_STRIP_PRIMARY_LENGTH }
    ],
    board
  });

  strip.on('ready', () => {
    rain.start(strip, DESK_LIGHT_STRIP_PRIMARY_LENGTH);
  });
});
