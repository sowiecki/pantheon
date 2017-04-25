/* eslint no-console:0 */
/* globals console */
import SpotifyWebApi from 'spotify-web-api-node';
import opn from 'opn';

import { ENV, PORT } from 'config';
import { SPOTIFY_PERMISSION_SCOPES, SPOTIFY_SYNC_STATE_TIMEOUT } from 'constants';
import { EMIT_REGISTER_SPOTIFY_CLIENT } from 'ducks/devices';
import { EMIT_SEND_SPOTIFY_COMMAND } from 'ducks/occurrences';
import store from 'store';
import Controller from './controller';

const spotifyController = new Controller({
  displayName: 'Spotify Controller',

  shouldInit: () => !!ENV.spotify,

  getRedirectUri: () => ENV.spotify.redirectUri || `http://localhost:${PORT}/api/register-spotify`,

  initialize() {
    const { clientId, clientSecret } = ENV.spotify;

    const spotifyApi = new SpotifyWebApi({
      clientId,
      clientSecret,
      redirectUri: spotifyController.getRedirectUri()
    });

    const authorizeURL = spotifyApi.createAuthorizeURL(SPOTIFY_PERMISSION_SCOPES);
    const handleOpnFailure = spotifyController.handleOpnFailure.bind(this, authorizeURL);

    // Assuming the correct callback URL was registered for the application,
    // this will begin the process to loop back to this server and register an auth token.
    // Register your callback URL here https://developer.spotify.com/my-applications
    opn(authorizeURL).catch(handleOpnFailure);

    store.dispatch({
      type: EMIT_REGISTER_SPOTIFY_CLIENT,
      spotifyApi
    });
  },

  syncState() {
    setTimeout(() => {
      store.dispatch({
        type: EMIT_SEND_SPOTIFY_COMMAND,
        name: 'playerDevices'
      });

      store.dispatch({
        type: EMIT_SEND_SPOTIFY_COMMAND,
        name: 'player'
      });
    }, SPOTIFY_SYNC_STATE_TIMEOUT);
  },

  /**
   * Since opn wraps xdg-open on Linux, which does not work over SSH,
   * we must use an alternative method to launch the authorization URL.
   */
  handleOpnFailure(authorizeURL) {
    console.log('===', authorizeURL)
    console.log('Failed to open Spotify authorize URL, trying alternative method');

    const display = ENV.spotify.display || '0';
    const browser = ENV.spotify.browser || 'chromium-browser';
    const cmd = `DISPLAY=:${display} ${browser} ${authorizeURL}`;

    require('child_process').exec(cmd);
  }
});

export default spotifyController;
