/* globals console */
/* eslint no-console: 0 */
import http from 'http';

import { setResponse } from 'utils';
import { config } from 'environment';
import store from '../store';
import { EMIT_REGISTER_UNIFIED_ID } from 'ducks/unified';
import { UNIFIED_REMOTE_PORT } from 'constants';

/**
 * Hacked together Unified Remote connection,
 * based on snooping UR's web client connections.
 *
 * Main requirements for establishing a useful UR connection:
 * 1) GET request to receive a UR-Connection-ID (unifiedID) for all future requests
 * 2) POST request to declare capabilities for unifiedID session
 *
 * After #1 and #2, POST requests can be sent requesting certain events, see ./send-unified.js
 */

const declareCapabilities = (unifiedID) => {
  const { hostname } = config.unified;

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

  request.on('error', ({ message }) => {
    console.log(`Problem with request: ${message}`);
  });

  request.end(capabilities);
};

const fetchUnified = (action, next) => {
  const { hostname } = config.unified;

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
