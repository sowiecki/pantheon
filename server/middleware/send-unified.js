/* globals console */
/* eslint no-console: 0 */
import http from 'http';

import { setResponse } from 'utils';
import { sendText } from './unified/commands';
import { config } from 'environment';
import store from '../store';

// import { EMIT_REGISTER_UNIFIED_ID } from 'ducks/unified';
import { UNIFIED_REMOTE_PORT } from 'constants';

/**
 * Send events to a Unified Remote server,
 * using a session established by ./fetch-unified.js
 */

const sendUnified = (action, next) => {
  const { hostname } = config.unified;
  const { unifiedID } = store.getState().unifiedReducer;

  const command = sendText('BizzBazz');

  const options = {
    hostname,
    port: UNIFIED_REMOTE_PORT,
    path: `http://${hostname}:${UNIFIED_REMOTE_PORT}/client/request`,
    method: 'POST',
    headers: {
      'UR-Connection-ID': unifiedID
    }
  };

  const request = http.request(options, (response) => {
    response.setEncoding('utf8');

    response.on('data', (data) => {
      setResponse(action, 200);

      console.log(data);

      // next({
      //   type:
      // });
    });
  });

  request.on('error', ({ message }) => {
    console.log(`Problem with request: ${message}`);
  });

  request.write(command);
  request.end();
};

export default sendUnified;
