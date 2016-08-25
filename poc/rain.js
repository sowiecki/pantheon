const five = require('johnny-five');
const pixel = require('node-pixel');

const board = new five.Board();

board.on('ready', () => {
  const strip = new pixel.Strip({
    data: 6,
    length: 60,
    color_order: pixel.COLOR_ORDER.GRB,
    controller: 'FIRMATA',
    board
  });


});
