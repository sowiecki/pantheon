/* eslint new-cap:0, no-console:0 */
/* globals console */
import WebSocket from 'ws';
import { get, map, intersection, uniq } from 'lodash';

import { ENV } from 'config';
import {
  WEBSOCKET_PROTOCOL,
  WEBSOCKET_RECONNECT_INTERVAL,
  WEBSOCKET_EXPIRATION_COUNTDOWN_INTERVAL,
  HANDSHAKE,
  RECONNECTED
} from 'constants';
import getEventHandlers from 'handlers';
import { logger, errorNoHandler, hash } from 'utils';
import store from 'store';

const proxyController = {
  displayName: 'Proxy Controller',

  expirationCounter: 2,

  shouldInit: () => !!ENV.proxyHost,

  initialize(id = ENV.id, password = ENV.password) {
    this.id = id;
    this.password = password;

    clearInterval(this.interval);

    this.webSocket = new WebSocket(ENV.proxyHost, WEBSOCKET_PROTOCOL);

    this.webSocket.onopen = this.handleConnection.bind(this);
    this.webSocket.onmessage = this.handleMessage.bind(this);
    this.webSocket.onclose = this.reconnect.bind(this);
    this.webSocket.onerror = this.reconnect.bind(this);

    this.webSocket.on('ping', this.resetExpirationCounter);
    this.beginExpirationCounter();
  },

  isAuthorized(payload) {
    const hashedPassword = get(payload, 'headers.hashed_password', '');

    if (!hashedPassword) return false;

    const isAuthorizedGuest = () => {
      const { guestEnabled } = store.getState().meta;

      if (!guestEnabled) return false;

      const events = uniq(map(payload.body, 'type'));
      const allowedEvents = intersection(ENV.guest.allowedEvents, events);
      const noUnallowedEvents = allowedEvents.length === events.length;
      const pendingConnection = [HANDSHAKE, RECONNECTED].includes(payload.event);

      return !pendingConnection && noUnallowedEvents && hashedPassword === hash(get(ENV, 'guest.password'), get(ENV, 'guest.id'));
    };

    return hashedPassword === hash(ENV.password, ENV.id) || isAuthorizedGuest();
  },

  handleConnection() {
    const payload = { headers: { id: this.id } };

    this.webSocket.send(JSON.stringify({ event: HANDSHAKE, payload }));
  },

  send(event, payload) {
    if (this.webSocket.readyState) {
      this.webSocket.send(JSON.stringify({ event, payload }));
    } else {
      logger.log('error', 'WebSocket is not currently open');
    }
  },

  handleMessage({ data }) {
    try {
      const { payload } = JSON.parse(data);
      const payloadEventHeader = get(JSON.parse(data), 'payload.event');
      const event = get(payload, 'headers.event', payloadEventHeader);

      const proxyHandlers = {
        [HANDSHAKE]: () => logger.log('info', `${this.id} - ${payload.message}`),
        [RECONNECTED]: () => logger.log('info', payload.message)
      };

      const isAuthorized = this.isAuthorized(payload);
      const handlers = isAuthorized ? getEventHandlers(payload) : proxyHandlers;
      const eventHandler = handlers[event];

      if (eventHandler) {
        eventHandler();
      } else if (event) {
        errorNoHandler(data);
      }
    } catch (e) {
      logger.log('error', e);
    }
  },

  reconnect(e) {
    clearInterval(this.interval);

    console.error('Error establishing proxy connection! ', e.message);

    this.interval = setInterval(() => {
      this.webSocket.terminate();
      this.initialize(this.id, this.password);
    }, WEBSOCKET_RECONNECT_INTERVAL);
  },

  terminate() {
    this.webSocket.terminate();
    clearInterval(this.interval); // Must be after terminate to prevent reconnection
  },

  beginExpirationCounter() {
    clearInterval(this.expirationInterval);

    this.expirationInterval = setInterval(() => {
      if (this.expirationCounter === 0) {
        this.terminate();
        this.reconnect();
        this.expirationCounter = 2;
      } else {
        this.expirationCounter--;
      }
    }, WEBSOCKET_EXPIRATION_COUNTDOWN_INTERVAL);
  },

  resetExpirationCounter() {
    this.expirationCounter = 0;
  }
};

export default proxyController;
