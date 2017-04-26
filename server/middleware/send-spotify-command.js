/* globals console */
/* eslint no-console: 0 */
import https from 'https';
import { isEmpty } from 'lodash';

import spotifyController from 'controllers/spotify';
import { SPOTIFY_HOST } from 'constants';
import { setResponse } from 'utils';

import * as commands from './spotify/commands';

const sendSpotifyCommand = (store, action, next) => {
  const state = store.getState().meta;
  const commandProperties = commands[action.name](action, state);

  const options = {
    ...commandProperties.options,
    method: commandProperties.options.method,
    host: SPOTIFY_HOST,
    path: commandProperties.options.path,
    headers: {
      Authorization: `Bearer ${state.spotifyAccessToken}`,
      ...commandProperties.options.headers
    }
  };

  if (!commandProperties.type) {
    spotifyController.syncState();
  }

  const request = https.request(options, (response) => {
    response.setEncoding('utf8');

    response.on('data', (data) => {
      setResponse({ next }, 200);

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

  if (!isEmpty(commandProperties.body)) {
    request.write(JSON.stringify(commandProperties.body));
  }

  request.end();
};

export default sendSpotifyCommand;
