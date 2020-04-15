import https from 'https';
import http from 'http';

const request = (protocol) => ({ options, payload }) =>
  new Promise((resolve, reject) => {
    const req = protocol.request(options, (response) => {
      response.setEncoding('utf8');

      let rawData = '';
      response.on('data', (chunk) => {
        rawData += chunk;
      });

      response.on('end', () => {
        resolve({ rawData, statusCode: response.statusCode });
      });
    });

    req.on('error', reject);

    req.end(payload);
  });

export const httpsRequest = request(https);
export const httpRequest = request(http);
