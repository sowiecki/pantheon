/* eslint new-cap:0, no-console:0 */
/* globals console */
import WebSocket from 'ws';
import { get, map, intersection, uniq } from 'lodash';

import { ENV } from 'config';
import {
  WEBSOCKET_PROTOCOL,
  WEBSOCKET_RECONNECT_INTERVAL,
  HANDSHAKE,
  RECONNECTED
} from 'constants';
import getEventHandlers from 'handlers';
import { logger, errorNoHandler } from 'utils';

let interval;
let webSocket;

const proxyController = {
  displayName: 'Proxy Controller',

  shouldInit: () => !!ENV.proxyHost,

  initialize(id = ENV.id) {
    this.id = id;

    clearInterval(interval);

    webSocket = new WebSocket(ENV.proxyHost, WEBSOCKET_PROTOCOL);

    webSocket.onopen = this.handleConnection.bind(this);
    webSocket.onmessage = this.parseEvent.bind(this);
    webSocket.onclose = this.reconnect;
    webSocket.onerror = this.handleConnectionError;
  },

  isAuthorized(id, payload) {
    const isGuest = this.id !== ENV.id;
    const isAuthorizedGuest = () => {
      const events = uniq(map(payload.body, 'type'));
      const allowedEvents = intersection(ENV.guest.allowedEvents, events);
      const noUnallowedEvents = allowedEvents.length === events.length;
      const pendingConnection = [HANDSHAKE, RECONNECTED].includes(payload.event);

      return !pendingConnection && noUnallowedEvents;
    };

    return isGuest ? isAuthorizedGuest() : id === this.id;
  },

  handleConnection() {
    const payload = { headers: { id: this.id } };

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

    const isAuthorized = this.isAuthorized(id, payload);
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
  },

  terminate() {
    console.log(`${this.id} proxy terminated.`);
    webSocket.close();
  }
};

export default proxyController;
