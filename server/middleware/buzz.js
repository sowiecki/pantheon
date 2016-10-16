/* globals console */
/* eslint no-console: 0 */
import http from 'http';

import { setResponse } from 'utils';
import { config } from 'environment';
import { EMIT_BUZZ_RESPONSE } from 'ducks/devices';
import { BUZZER_API } from 'constants';

const buzz = (action, next) => {
  setResponse(action, 200);

  const payload = JSON.stringify({
    code: action.code
  });

  const options = {
    hostname: config.buzzer.hostname,
    port: config.buzzer.port,
    path: BUZZER_API,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': payload.length
    }
  };

  const request = http.request(options, (response) => {
    response.setEncoding('utf8');
    response.on('data', (chunk) => {
      console.log(`Buzz response: ${chunk}`);

      next({
        type: EMIT_BUZZ_RESPONSE,
        status: JSON.parse(chunk).status
      });
    });
  });

  request.on('error', ({ message }) => {
    console.log(`Problem with request: ${message}`);
  });

  request.write(payload);
  request.end();
};

export default buzz;
