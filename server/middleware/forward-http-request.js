/* globals console */
/* eslint no-console: 0 */
import http from 'http';
import { get } from 'lodash';

import { stringifyObjectValues, setResponse } from 'utils';
import { config } from 'environment';

/**
 * Forwards an HTTP request using parameters either provided directly by an action,
 * or matches a provided key to pre-defined parameters in config.json.
 */
const forwardHTTPRequest = (action, next) => {
  const { key } = action;
  const keyIsInvalid = key && !config.httpRequests[key];

  if (keyIsInvalid) {
    throw new Error(`Property ${key} not declared in httpRequests property of config.json`);
  }

  const body = get(config, `httpRequests[${key}].body)`, action.body);
  const optionsOverride = get(config, `httpRequests[${key}].options`, action.options);

  const payload = body ? JSON.stringify(body) : null;

  const additionalHeaders = stringifyObjectValues(optionsOverride.headers);

  const options = {
    method: action.method || 'POST',
    ...optionsOverride,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': payload ? payload.length : 0,
      ...additionalHeaders
    }
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
