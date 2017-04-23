/* globals console */
/* eslint no-console: 0 */
import https from 'https';

import { SPOTIFY_HOST } from 'constants';
import { setResponse } from 'utils';

import * as commands from './spotify/commands';

const sendSpotifyCommand = (store, action, next) => {
  const commandProperties = commands[action.name](action);
  const { spotifyAccessToken } = store.getState().meta;

  const options = {
    method: commandProperties.options.method,
    host: SPOTIFY_HOST,
    path: commandProperties.options.path,
    headers: {
      Authorization: `Bearer ${spotifyAccessToken}`
    },
    ...commandProperties.options.headers
  };

  const request = https.request(options, (response) => {
    response.setEncoding('utf8');

    response.on('data', (data) => {
      setResponse({ next }, 200);
      console.log(data)

      if (commandProperties.type) {
        next({
          type: commandProperties.type,
          data: JSON.parse(data)
        });
      }
    });
  });

  request.on('error', ({ message }) => {
    console.log(`Problem with request: ${message}`);
  });

  if (commandProperties.body) {
    request.write(JSON.stringify(commandProperties.body));
  }

  request.end();
};

export default sendSpotifyCommand;
