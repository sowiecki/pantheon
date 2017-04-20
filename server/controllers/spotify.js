import SpotifyWebApi from 'spotify-web-api-node';
import opn from 'opn';
import { get } from 'lodash';

import { ENV, PORT } from 'config';
import { SPOTIFY_PERMISSION_SCOPES } from 'constants';
import { EMIT_REGISTER_SPOTIFY_CLIENT } from 'ducks/devices';
import store from 'store';
import Controller from './controller';

const spotifyController = new Controller({
  displayName: 'Spotify Controller',

  shouldInit: () => !!ENV.spotify,

  getRedirectUri: () => ENV.spotify.redirectUri || `http://localhost:${PORT}/api/register-spotify`,

  getToken() {
    const { meta } = store.getState();

    return get(meta, 'spotify.token');
  },

  initialize() {
    const { clientId, clientSecret } = ENV.spotify;

    const spotifyApi = new SpotifyWebApi({
      clientId,
      clientSecret,
      redirectUri: spotifyController.getRedirectUri()
    });

    const authorizeURL = spotifyApi.createAuthorizeURL(SPOTIFY_PERMISSION_SCOPES);

    // Assuming the correct callback URL was registered for the application,
    // this will begin the process to loop back to this server and register an auth token.
    // Register the callback URL here https://developer.spotify.com/my-applications
    opn(authorizeURL);

    store.dispatch({
      type: EMIT_REGISTER_SPOTIFY_CLIENT,
      spotifyApi
    });
  }
});

export default spotifyController;
