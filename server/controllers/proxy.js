/* eslint new-cap:0, no-console:0 */
/* globals console */
import WebSocket from 'ws';
import { get } from 'lodash';

import { config } from 'environment';
import getStandardHandlers from 'handlers';
import { WEBSOCKET_PROTOCOL,
         WEBSOCKET_RECONNECT_INTERVAL,
         HANDSHAKE,
         RECONNECTED } from 'constants';
import { getEventHandler, errorNoHandler } from 'utils';

let interval;
let webSocket;

const proxyController = () => ({
  initialize() {
    clearInterval(interval);

    if (!config.proxyHost) {
      return;
    }

    webSocket = new WebSocket(config.proxyHost, WEBSOCKET_PROTOCOL);

    webSocket.onopen = this.handleConnection;
    webSocket.onmessage = this.parseEvent;
    webSocket.onclose = this.reconnect;
  },

  handleConnection() {
    const payload = { headers: { id: config.id } };

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
    const id = get(payload, 'headers.id');
    const event = get(payload, 'headers.event');

    const proxyHandlers = {
      ...getStandardHandlers(payload),

      [HANDSHAKE]() {
        console.log(payload.message);
      },

      [RECONNECTED]() {
        console.log(payload.message);
      }
    };

    const eventHandler = getEventHandler(event, proxyHandlers);

    if (id === config.id) {
      if (proxyHandlers[event]) {
        eventHandler();
        // TODO update Acheron to accept _RESPONSE events
        // proxyController().send(`${payload.event}_RESPONSE`, 200);
      } else {
        errorNoHandler(event);
        // proxyController().send(`${payload.event}_RESPONSE`, 500);
      }
    } else {
      // proxyController().send(`${payload.event}_RESPONSE`, 403);
    }
  },

  reconnect() {
    interval = setInterval(() => {
      proxyController().initialize();
    }, WEBSOCKET_RECONNECT_INTERVAL);
  }
});

export default proxyController;
