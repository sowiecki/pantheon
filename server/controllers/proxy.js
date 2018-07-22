/* eslint new-cap:0, no-console:0 */
/* globals console */
import WebSocket from 'ws';
import scrypt from 'scrypt';
import { get, map, intersection, uniq } from 'lodash';
import moment from 'moment';

import { ENV } from 'config';
import {
  WEBSOCKET_PROTOCOL,
  WEBSOCKET_RECONNECT_INTERVAL,
  WEBSOCKET_EXPIRATION_COUNTDOWN_INTERVAL,
  HANDSHAKE,
  RECONNECTED,
  SCRYPT_SETTINGS
} from 'constants';
import getEventHandlers from 'handlers';
import { logger, errorNoHandler } from 'utils';

const proxyController = {
  displayName: 'Proxy Controller',

  expirationCounter: 2,

  shouldInit: () => !!ENV.proxyHost,

  initialize() {
    clearInterval(this.interval);

    this.webSocket = new WebSocket(ENV.proxyHost, WEBSOCKET_PROTOCOL);

    this.webSocket.onopen = this.handleConnection.bind(this);
    this.webSocket.onmessage = this.parseEvent.bind(this);
    this.webSocket.onclose = this.reconnect.bind(this);
    this.webSocket.onerror = this.reconnect.bind(this);

    this.webSocket.on('ping', this.resetExpirationCounter);
    this.beginExpirationCounter();
  },

  hash: (password) => scrypt.hashSync(password, SCRYPT_SETTINGS, 32, ENV.id).toString('hex'),

  isAuthorized(hashedPassword, payload) {
    const isAuthorizedGuest = () => {
      const events = uniq(map(payload.body, 'type'));
      const allowedEvents = intersection(ENV.guest.allowedEvents, events);
      const noUnallowedEvents = allowedEvents.length === events.length;
      const pendingConnection = [HANDSHAKE, RECONNECTED].includes(payload.event);

      return !pendingConnection && noUnallowedEvents && hashedPassword === this.hash(get(ENV, 'guest.password'));
    };
    console.log(hashedPassword, this.hash(ENV.password));
    return payload.isGuest ? isAuthorizedGuest() : hashedPassword === this.hash(ENV.password);
  },

  handleConnection() {
    const payload = { headers: { id: ENV.id } };

    this.webSocket.send(JSON.stringify({ event: HANDSHAKE, payload }));
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
      const hashedPassword = get(payload, 'headers.hashed_password', '');
      const payloadEventHeader = get(JSON.parse(data), 'payload.event');
      const event = get(payload, 'headers.event', payloadEventHeader);

      const proxyHandlers = {
        [HANDSHAKE]: () => logger.log('info', `${this.password} - ${payload.message}`),
        [RECONNECTED]: () => logger.log('info', payload.message)
      };

      const isAuthorized = hashedPassword && this.isAuthorized(hashedPassword, payload);
      const handlers = isAuthorized ? getEventHandlers(payload) : proxyHandlers;
      const eventHandler = handlers[event];

      if (eventHandler) {
        eventHandler();
      } else if (event) {
        errorNoHandler(event);
      }
    } catch (e) {
      logger.log('error', e);
    }
  },

  reconnect() {
    clearInterval(this.interval);

    this.interval = setInterval(() => {
      this.webSocket.terminate();
      this.initialize();
    }, WEBSOCKET_RECONNECT_INTERVAL);
  },

  terminate() {
    this.webSocket.terminate();
    clearInterval(this.interval); // Must be after terminate to prevent reconnection
  },

  beginExpirationCounter() {
    this.expirationInterval = setInterval(() => {
      if (this.expirationCounter === 0) {
        const timeSinceLastPing = moment
          .duration(WEBSOCKET_EXPIRATION_COUNTDOWN_INTERVAL * 2, 'ms')
          .asMinutes();

        logger.log(
          'error',
          `No ping from proxy server received in last ${timeSinceLastPing} minutes, reconnecting.`
        );
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
