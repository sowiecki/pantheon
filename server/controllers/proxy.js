/* eslint new-cap:0, no-console:0 */
/* globals console */
import WebSocket from 'ws';
import { get, map, intersection, uniq } from 'lodash';

import { ENV } from 'config';
import {
  WEBSOCKET_PROTOCOL,
  WEBSOCKET_REFRESH_INTERVAL,
  WEBSOCKET_RECONNECT_INTERVAL,
  HANDSHAKE,
  RECONNECTED
} from 'constants';
import getEventHandlers from 'handlers';
import { logger, errorNoHandler } from 'utils';

const proxyController = {
  displayName: 'Proxy Controller',

  shouldInit: () => !!ENV.proxyHost,

  initialize(id = ENV.id) {
    this.id = id;

    clearInterval(this.interval);

    this.webSocket = new WebSocket(ENV.proxyHost, WEBSOCKET_PROTOCOL);

    this.webSocket.onopen = this.handleConnection.bind(this);
    this.webSocket.onmessage = this.parseEvent.bind(this);
    this.webSocket.onclose = this.reconnect.bind(this);
    this.webSocket.onerror = this.handleConnectionError;

    this.reconnect(WEBSOCKET_REFRESH_INTERVAL);
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

    this.webSocket.send(JSON.stringify({ event: HANDSHAKE, payload }));
  },

  handleConnectionError(e) {
    throw new Error(e);
  },

  send(event, payload) {
    if (this.webSocket.readyState) {
      this.webSocket.send(JSON.stringify({ event, payload }));
    } else {
      logger.log('error', 'WebSocket is not currently open');
    }
  },

  parseEvent({ data }) {
    try {
      const { payload } = JSON.parse(data);
      const id = get(payload, 'headers.id');
      const payloadEventHeader = get(JSON.parse(data), 'payload.event');
      const event = get(payload, 'headers.event', payloadEventHeader);

      const proxyHandlers = {
        [HANDSHAKE]: () => logger.log('info', `${this.id} - ${payload.message}`),
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
    } catch (e) {
      console.error(e);
    }
  },

  reconnect(timeout = WEBSOCKET_RECONNECT_INTERVAL) {
    if (this.webSocket) {
      this.webSocket.clients.forEach((ws) => ws.terminate());
    }

    this.interval = setInterval(() => {
      this.initialize(this.id);
    }, timeout);
  },

  terminate() {
    this.webSocket.terminate();
    clearInterval(this.interval); // Must be after terminate to prevent reconnection
  }
};

export default proxyController;
