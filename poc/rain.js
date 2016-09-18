const five = require('johnny-five');
const pixel = require('node-pixel');
const map = require('lodash/map');

const DESK_LIGHT_STRIP_PRIMARY_LENGTH = 60;
const DESK_LIGHT_STRIP_PRIMARY_PIN = 6;
const BLACK = 'rgb(0, 0, 0)';
const FPS = 1;

const getPositions = (stripLength) => new Array(stripLength).fill(0).map((x, i) => i);

const board = new five.Board({
  // port: '/dev/ttyACM0',
  // repl: false
});

const rain = {
  start(strip, stripLength) {
    const random = () => Math.floor(Math.random() * 59) + 1;

    this.interval = setInterval(() => {
      const positionsToLight = new Array(10).fill().map(() => ({ intensity: 255, position: random() }));

      strip.color(BLACK);

      map(positionsToLight, (positionToLight) => {
        for(let i = 0; i < positionToLight.intensity; i++) {
          const color = `rgb(0, 0, ${positionToLight.intensity})`;

          strip.show();

          if (positionToLight.intensity <= 0) {
            positionToLight.intensity = positionToLight.intensity - 1;
          } else {
            positionToLight.intensity = 255;
          }
        }

        return positionToLight;
      });
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
    rain.start(strip, DESK_LIGHT_STRIP_PRIMARY_LENGTH)
  });
});
