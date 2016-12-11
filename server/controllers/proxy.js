/* eslint new-cap:0, no-console:0 */
/* globals console */
import WebSocket from 'ws';

import { config } from 'environment';
import { WEBSOCKET_PROTOCOL,
         WEBSOCKET_RECONNECT_INTERVAL,
         HANDSHAKE,
         RECONNECTED,
         BUZZ,
         BUZZ_EVENTS,
         BATCH_EVENTS } from 'constants';
import { batchEvents, handleEvent } from 'utils';
import store from '../store';

let interval;
let webSocket;

const proxyController = () => ({
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

      /**
       * Special snowflake handler for Particle Photon buzzer, because holy-fucking-shit
       * their webhooks don't support custom request bodies
       */
      [BUZZ]() {
        if (payload.id === config.id) {
          batchEvents(store, BUZZ_EVENTS);
        }
      },

      [BATCH_EVENTS]() {
        if (payload.id === config.id) {
          const events = payload.body;

          batchEvents(store, events);
        }
      },

      [undefined]() {
        console.log('Unhandled event', JSON.parse(data));
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

export default proxyController;
