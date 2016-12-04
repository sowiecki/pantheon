/* globals console */
/* eslint no-console: 0 */
import http from 'http';

import { setResponse } from 'utils';
import { config } from 'environment';
import { EMIT_REGISTER_UNIFIED_ID } from 'ducks/unified';
import { UNIFIED_REMOTE_PORT } from 'constants';

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
      setResponse(action, 200);

      next({
        type: EMIT_REGISTER_UNIFIED_ID,
        unifiedID: JSON.parse(data).id
      });
    });
  });

  request.on('error', ({ message }) => {
    console.log(`Problem with request: ${message}`);
  });

  request.end();
};

export default fetchUnified;
