/* eslint no-console:0 */
/* globals console */
import SpotifyWebApi from 'spotify-web-api-node';
import open from 'open';
import { get } from 'lodash';

import { ENV, PORT } from 'config';
import { SPOTIFY_PERMISSION_SCOPES, SPOTIFY_SYNC_STATE_TIMEOUT } from 'constants';
import { EMIT_REGISTER_SPOTIFY_CLIENT } from 'ducks/devices';
import { EMIT_SEND_SPOTIFY_COMMAND } from 'ducks/occurrences';
import store from 'store';

const spotifyController = {
  displayName: 'Spotify Controller',

  shouldInit: () => !!ENV.spotify,

  getRedirectUri: () => ENV.spotify.redirectUri || `http://localhost:${PORT}/api/register-spotify`,

  getPermissionScopes() {
    const blacklistedPermissions = get(ENV, 'spotify.blacklistedPermissions', []);
    const filterBlacklisted = (e) => !blacklistedPermissions.includes(e);
    const permissionScopes = SPOTIFY_PERMISSION_SCOPES.filter(filterBlacklisted);

    return permissionScopes;
  },

  initialize: () => {
    const { clientId, clientSecret } = ENV.spotify;
    const spotifyApi = new SpotifyWebApi({
      clientId,
      clientSecret,
      redirectUri: spotifyController.getRedirectUri()
    });

    const authorizeURL = spotifyApi.createAuthorizeURL(spotifyController.getPermissionScopes());

    // Assuming the correct callback URL was registered for the application,
    // this will begin the process to loop back to this server and register an auth token.
    // Register your callback URL here https://developer.spotify.com/my-applications.
    // This flow can be vastly improved to be more cross-platform compatible!
    if (ENV.spotify.display !== undefined || ENV.spotify.browser) {
      spotifyController.open(authorizeURL);
    } else {
      try {
        open(authorizeURL);
      } catch (e) {
        console.log(e, 'Failed to open Spotify authorize URL, trying alternative method');
        spotifyController.open(authorizeURL);
      }
    }

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
   * Since open wraps xdg-open on Linux, which does not work over SSH,
   * we must use an alternative method to launch the authorization URL.
   */
  open(authorizeURL) {
    const display = ENV.spotify.display || '0';
    const browser = ENV.spotify.browser || 'chromium';
    const cmd = `DISPLAY=:${display} ${browser} '${authorizeURL}'`;

    console.log(`Executing '${cmd}'`);

    require('child_process').exec(cmd);

    if (ENV.spotify.forceKill) {
      setTimeout(7500, () => {
        const killCmd = `pkill ${browser}`;
        require('child_process').exec(killCmd);
      });
    }
  }
};

export default spotifyController;
