/* globals console */
/* eslint no-console: 0 */
import http from 'http';

import { buzzer } from '../environment';
import { BUZZER_API } from '../constants';

const buzz = (action, next) => {
  const options = {
    hostname: buzzer.hostname,
    port: buzzer.port,
    path: BUZZER_API,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      code: action.code
    }
  };

  const request = http.request(options, (response) => {
    response.setEncoding('utf8');
    response.on('data', (chunk) => {
      console.log(`Buzz response: ${chunk}`);
    });
  });

  request.on('error', ({ message }) => {
    console.log(`Problem with request: ${message}`);
  });

  request.end();

  next();
};

export default buzz;
