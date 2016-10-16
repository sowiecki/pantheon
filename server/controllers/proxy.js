/* eslint new-cap:0, no-console:0 */
/* globals console */
import WebSocket from 'ws';

import { buzzerController } from './buzzer';
import { deadboltController } from './deadbolt';
import { config } from 'environment';
import { WEBSOCKET_PROTOCOL,
         WEBSOCKET_RECONNECT_INTERVAL,
         HANDSHAKE,
         RECONNECTED,
         FORWARD,
         BUZZ,
         DEADBOLT_COM } from 'constants';
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
    webSocket.send(JSON.stringify({ event, payload }));
  },

  parseEvent({ data }) {
    const { event, payload } = JSON.parse(data);

    const handlers = {
      [HANDSHAKE]() {
        console.log(payload.message);
      },

      [RECONNECTED]() {
        console.log(payload.message);
      },

      [FORWARD]() {
        console.log(event, payload);
      },

      [BUZZ]() {
        buzzerController().buzz();
      },

      [DEADBOLT_COM]() {
        deadboltController().toggle(payload.id);
      },

      [undefined]() {
        console.log(JSON.parse(data));
      }
    };

    handleEvent(event, handlers);
  },

  reconnect() {
    interval = setInterval(() => {
      proxyController().initialize();
    }, WEBSOCKET_RECONNECT_INTERVAL);
  }
});
