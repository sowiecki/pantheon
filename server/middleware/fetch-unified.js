/* globals console */
/* eslint no-console: 0 */
import http from 'http';

import { ENV } from 'config';
import { UNIFIED_REMOTE_PORT } from 'constants';
import { EMIT_REGISTER_UNIFIED_ID } from 'ducks/devices';
import { setResponse } from 'utils';

/**
 * A hacked together, reverse-engineered Unified Remote (UR) connection implementation,
 * based solely on snooping the UR web client source and network activity.
 * Credit to https://www.unifiedremote.com/ for an awesome application.
 * (A well-documented REST API would be even more awesome...)
 *
 * As best as it could be ascertained,
 * these seem to be the only requirements for establishing a useful UR connection:
 * 1) GET request to receive a UR-Connection-ID (unifiedID) for all future requests.
 * 2) POST request to declare capabilities for unifiedID session.
 *
 * UR seems to keep alive/refresh sessions with a setInterval function.
 * It may not be necessary to constantly generate a new UR-Connection-ID,
 * but it doesn't seem harmful, and it maintains an active session for the application.
 *
 * With an active session,
 * POST requests can be sent to trigger events (see ./send-unified-command.js)
 */

const declareCapabilities = (unifiedID) => {
  const { hostname } = ENV.unified;

  const capabilities = JSON.stringify({
    Capabilities: {
      Actions: true,
      Sync: true,
      Grid: true,
      Fast: false,
      Loading: true,
      Encryption2: true
    },
    Action: 1,
    Request: 1
  });

  const options = {
    hostname,
    port: UNIFIED_REMOTE_PORT,
    path: `http://${hostname}:${UNIFIED_REMOTE_PORT}/client/request`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'UR-Connection-ID': unifiedID
    }
  };

  const request = http.request(options);

  request.on('data', () => {
    console.log('Connected to Unified Server');
  });

  request.on('error', ({ message }) => {
    console.log(`Problem with request: ${message}`);
  });

  request.end(capabilities);
};

const fetchUnified = (action, next) => {
  const { hostname } = ENV.unified;

  const options = {
    hostname,
    port: UNIFIED_REMOTE_PORT,
    path: `http://${hostname}:${UNIFIED_REMOTE_PORT}/client/connect`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };


  const request = http.request(options, (response) => {
    response.setEncoding('utf8');
    response.on('data', (data) => {
      const unifiedID = JSON.parse(data).id;

      setResponse(action, 200);

      declareCapabilities(unifiedID);

      next({
        type: EMIT_REGISTER_UNIFIED_ID,
        unifiedID
      });
    });
  });

  request.on('error', ({ message }) => {
    console.log(`Problem with request: ${message}`);
  });

  request.end();
};

export default fetchUnified;
