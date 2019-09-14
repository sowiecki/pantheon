/* globals console */
/* eslint no-console: 0 */
import http from 'http';
import { get } from 'lodash';

import { ENV } from 'config';
import { stringifyObjectValues, setResponse } from 'utils';

/**
 * Forwards an HTTP request using parameters either provided directly by an action,
 * or matches a provided key to pre-defined parameters in ENV.json.
 */
const forwardHTTPRequest = (action, next) => {
  const { key } = action;
  const keyIsInvalid = key && !ENV.httpRequests[key];

  if (keyIsInvalid) {
    throw new Error(`Property ${key} not declared in httpRequests property of ENV.json`);
  }

  const body = get(ENV, `httpRequests[${key}].body)`, action.body);
  const optionsOverride = get(ENV, `httpRequests[${key}].options`, action.options);

  const payload = body ? JSON.stringify(body) : null;

  const headers = stringifyObjectValues({
    ...optionsOverride.headers,
    ...action.additionalHeaders
  });

  const options = {
    method: action.method || 'POST',
    ...optionsOverride,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': payload ? payload.length : 0,
      ...headers
    }
  };

  const request = http.request(options, (response) => {
    response.setEncoding('utf8');
    response.on('data', (chunk) => {
      console.log(`Response: ${chunk}`);

      try {
        setResponse(next, JSON.parse(chunk).status);
      } catch(e) {
        console.log('Problem with request, e');
      }
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
