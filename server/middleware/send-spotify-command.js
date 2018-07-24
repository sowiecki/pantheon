/* globals console */
/* eslint no-console: 0 */
import https from 'https';
import { isEmpty } from 'lodash';

import spotifyController from 'controllers/spotify';
import { SPOTIFY_HOST } from 'constants';
import { formatRequestKeys, setResponse, logger } from 'utils';

import * as commands from './spotify/commands';

const sendSpotifyCommand = (store, action, next) => {
  const state = store.getState().meta;
  const commandProperties = formatRequestKeys(commands[action.name])(action, state);
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

  let body = '';

  const request = https.request(options, (response) => {
    response.setEncoding('utf8');

    response.on('data', (data) => {
      body += data;
    });

    response.on('end', () => {
      if (commandProperties.type && body.length !== 0) {
        next({
          type: commandProperties.type,
          data: JSON.parse(body)
        });
      } else {
        logger.log('Problem with response from Spotify authentication');
      }

      setResponse({ next }, 200);
    });
  });

  request.on('error', ({ message }) => {
    console.log(`Problem with request: ${message}`);
  });

  if (!isEmpty(commandProperties.body)) {
    request.write(JSON.stringify(commandProperties.body));

    if (commandProperties.type) {
      try {
        const data = JSON.parse(body);

        next({
          type: commandProperties.type,
          data
        });
      } catch (e) {
        console.error(e);
      }
    }
  }

  request.end();
};

export default sendSpotifyCommand;
