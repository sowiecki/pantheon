/* eslint new-cap:0, no-console:0 */
/* globals console */
import WebSocket from 'ws';

import { buzzerController, deskController, hueController, unifiedController } from './';
import { deadboltController } from './deadbolt';
import { config } from 'environment';
import { WEBSOCKET_PROTOCOL,
         WEBSOCKET_RECONNECT_INTERVAL,
         HANDSHAKE,
         RECONNECTED,
         BUZZ,
         PC_ON,
         LIGHTS_COM,
         SOUND_COM,
         DEADBOLT_COM,
         UNIFIED_BATCH } from 'constants';
import { handleEvent } from 'utils';

let interval;
let webSocket;

export const proxyController = () => ({
  initialize() {
    clearInterval(interval);
    webSocket = new WebSocket(config.proxyHost, WEBSOCKET_PROTOCOL);

    webSocket.onopen = this.handleConnection;
    webSocket.onmessage = this.parseEvent;
    webSocket.onclose = this.reconnect;
  },

  handleConnection() {
    const payload = { id: config.id };
    webSocket.send(JSON.stringify({ event: HANDSHAKE, payload }));
  },

  send(event, payload) {
    if (webSocket.readyState) {
      webSocket.send(JSON.stringify({ event, payload }));
    } else {
      console.log('WebSocket is not currently open');
    }
  },

  parseEvent({ data }) {
    const { payload } = JSON.parse(data);

    const handlers = {
      [HANDSHAKE]() {
        console.log(payload.message);
      },

      [RECONNECTED]() {
        console.log(payload.message);
      },

      [BUZZ]() {
        buzzerController().buzz();
      },

      [DEADBOLT_COM]() {
        deadboltController().toggle(payload.id);
      },

      [PC_ON]() {
        deskController().pcOn();
      },

      [LIGHTS_COM]() {
        hueController().parseCom(payload.body.payload);
      },

      [SOUND_COM]() {
        deskController().parseSoundCom(payload.body.payload);
      },

      [UNIFIED_BATCH]() {
        unifiedController().batch(payload.body);
      },

      [undefined]() {
        console.log(JSON.parse(data));
      }
    };

    handleEvent(payload.event, handlers);
  },

  reconnect() {
    interval = setInterval(() => {
      proxyController().initialize();
    }, WEBSOCKET_RECONNECT_INTERVAL);
  }
});
