/* globals console */
/* eslint no-console: 0 */
import http from 'http';
import { get } from 'lodash';

import { setResponse } from 'utils';
import { config } from 'environment';

const forwardHTTPRequest = (action, next) => {
  const { key, body } = action;

  const payload = JSON.stringify(body || config.http_requests[key].body);
  const optionsOverride = get(config, `[http_requests][${key}].options`, action);

  const options = {
    method: action.method || 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': payload.length
    },
    ...optionsOverride
  };

  const request = http.request(options, (response) => {
    response.setEncoding('utf8');
    response.on('data', (chunk) => {
      console.log(`Response: ${chunk}`);

      setResponse(next, JSON.parse(chunk).status);
    });
  });

  request.on('error', ({ message }) => {
    console.log(`Problem with request: ${message}`);
  });

  if (payload) {
    request.write(payload);
  }

  request.end();
};

export default forwardHTTPRequest;
