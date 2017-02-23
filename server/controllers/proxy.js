/* eslint new-cap:0, no-console:0 */
/* globals console */
import WebSocket from 'ws';
import { get } from 'lodash';

import { config } from 'environment';
import getEventHandlers from 'handlers';
import { WEBSOCKET_PROTOCOL,
         WEBSOCKET_RECONNECT_INTERVAL,
         HANDSHAKE,
         RECONNECTED } from 'constants';
import { logger, errorNoHandler } from 'utils';

let interval;
let webSocket;

const proxyController = {
  displayName: 'Proxy Controller',

  shouldInit() {
    return !!config.proxyHost;
  },

  initialize() {
    clearInterval(interval);

    webSocket = new WebSocket(config.proxyHost, WEBSOCKET_PROTOCOL);

    webSocket.onopen = this.handleConnection;
    webSocket.onmessage = this.parseEvent;
    webSocket.onclose = this.reconnect;
    webSocket.onerror = this.handleConnectionError;
  },

  handleConnection() {
    const payload = { headers: { id: config.id } };

    webSocket.send(JSON.stringify({ event: HANDSHAKE, payload }));
  },

  handleConnectionError(e) {
    throw new Error(e);
  },

  send(event, payload) {
    if (webSocket.readyState) {
      webSocket.send(JSON.stringify({ event, payload }));
    } else {
      logger.log('error', 'WebSocket is not currently open');
    }
  },

  parseEvent({ data }) {
    const { payload } = JSON.parse(data);
    const id = get(payload, 'headers.id');
    const payloadEventHeader = get(JSON.parse(data), 'payload.event');
    const event = get(payload, 'headers.event', payloadEventHeader);

    const proxyHandlers = {
      [HANDSHAKE]: () => logger.log('info', payload.message),
      [RECONNECTED]: () => logger.log('info', payload.message)
    };

    const isAuthorized = id === config.id;
    const handlers = isAuthorized ? getEventHandlers(payload) : proxyHandlers;
    const eventHandler = handlers[event];

    if (eventHandler) {
      eventHandler();
    } else if (event) {
      errorNoHandler(event);
    }
  },

  reconnect() {
    interval = setInterval(() => {
      proxyController.initialize();
    }, WEBSOCKET_RECONNECT_INTERVAL);
  }
};

export default proxyController;
