/* globals console */
/* eslint no-console: 0 */
import http from 'http';

import { setResponse } from 'utils';
import { config } from 'environment';
import store from '../store';

// import { EMIT_REGISTER_UNIFIED_ID } from 'ducks/unified';
import { UNIFIED_REMOTE_PORT } from 'constants';

const sendUnified = (action, next) => {
  const { hostname } = config.unified;
  const { unifiedID } = store.getState().unifiedReducer;

  const options = {
    hostname,
    port: UNIFIED_REMOTE_PORT,
    path: `http://${hostname}:${UNIFIED_REMOTE_PORT}/client/request`,
    data: JSON.stringify({ ID: 'Unified.Chrome', Action: 3, Request: 3, Layout: {}, Source: 'web-b15db286-19e0-4ad2-a73a-ecda926cdc55' }),
    method: 'POST',
    headers: {
      'UR-Connection-ID': unifiedID
    }
  };

  const request = http.request(options, (response) => {
    response.setEncoding('utf8');
    response.on('data', (data) => {
      setResponse(action, 200);

      console.log(data)

      // next({
      //   type: EMIT_REGISTER_UNIFIED_ID,
      // });
    });
  });

  request.on('error', ({ message }) => {
    console.log(`Problem with request: ${message}`);
  });

  request.end();
};

export default sendUnified;
