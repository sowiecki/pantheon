import { HueApi, lightState } from 'node-hue-api';
import five from 'johnny-five';
import pixel from 'node-pixel';

import { hueController } from '../controllers';
import { config } from '../environment';
import { handleAction, cylonEye } from '../utils';

export const EMIT_REGISTER_BOARD = 'EMIT_REGISTER_BOARD';
export const EMIT_REGISTER_BRIDGE = 'EMIT_REGISTER_BRIDGE';
export const EMIT_TURN_ON_LIGHT = 'EMIT_TURN_ON_LIGHT';
export const EMIT_TURN_OFF_LIGHT = 'EMIT_TURN_OFF_LIGHT';
export const EMIT_SERIAL_DATA_CHANGE = 'EMIT_SERIAL_DATA_CHANGE';

const initialState = {
  ports: config.ports,
  lightState: lightState.create(),
  hueUserId: config.users[Object.keys(config.users)[0]]
};

const devicesReducer = (state = initialState, action) => {
  const reducers = {
    [EMIT_REGISTER_BOARD]() {
      state.board = new five.Board({
        port: config.ports.jFive,
        repl: false
      });

      const STRIP_LENGTH = 60;

      state.board.on('ready', () => {
        const strip = new pixel.Strip({
          data: 6,
          length: STRIP_LENGTH,
          color_order: pixel.COLOR_ORDER.GRB,
          board: state.board,
          controller: 'FIRMATA',
        });

        strip.on('ready', () => {
          cylonEye.start(strip, STRIP_LENGTH);
        });
      });

      return state;
    },

    [EMIT_REGISTER_BRIDGE]() {
      state.hueBridge = new HueApi(action.bridge.ipaddress, state.hueUserId);

      return state;
    },

    [EMIT_TURN_ON_LIGHT]() {
      state.hueBridge.setLightState(2, state.lightState.on());

      return state;
    },

    [EMIT_TURN_OFF_LIGHT]() {
      state.hueBridge.setLightState(2, state.lightState.off());

      return state;
    },

    [EMIT_SERIAL_DATA_CHANGE]() {
      state.hueBridge.getLightStatus(2).then((lightStatus) => {
        if (lightStatus.state.on) {
          reducers.EMIT_TURN_OFF_LIGHT();
        } else {
          reducers.EMIT_TURN_ON_LIGHT();
        }
      });

      return state;
    }
  };

  return handleAction(state, action, reducers);
};

export default devicesReducer;
