/* eslint new-cap:0, no-console:0 */
/* globals console */
import WebSocket from 'ws';

import { config } from 'environment';
import { WEBSOCKET_PROTOCOL,
         WEBSOCKET_RECONNECT_INTERVAL,
         HANDSHAKE,
         RECONNECTED,
         DISPATCH_EVENTS,
         UNIFIED_BATCH } from 'constants';
import { handleEvent } from 'utils';
import { unifiedController } from './';
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

      [DISPATCH_EVENTS]() {
        if (payload.id === config.id) {
          payload.body.forEach((event) => {
            console.log('dispatching', event);
            store.dispatch({
              ...event,
              devices: store.getState().devicesReducer
            });
          });
        }
      },

      [UNIFIED_BATCH]() {
        unifiedController().batch(payload);
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
