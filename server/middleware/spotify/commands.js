import { get } from 'lodash';

import { SPOTIFY_API } from 'constants';
import {
  EMIT_REGISTER_SPOTIFY_PLAYER,
  EMIT_REGISTER_SPOTIFY_DEVICES,
  EMIT_SPOTIFY_PLAYLISTS_UPDATE
} from 'ducks/occurrences';

const prependAPI = (path) => `${SPOTIFY_API}${path}`;

/**
 * Command functions each return an object containing properties, request options and body,
 * used to created a Spotify Web API-compatible HTTP request.
 *
 * They may also contain an optional action type for handling response data.
 * If they do NOT contain a type property, spotifyController.resyncState will
 * resync generic state properties, e.g. player and device statuses.
 */

export const player = () => ({
  type: EMIT_REGISTER_SPOTIFY_PLAYER,
  options: {
    method: 'GET',
    path: prependAPI('me/player')
  }
});

export const playerDevices = () => ({
  type: EMIT_REGISTER_SPOTIFY_DEVICES,
  options: {
    method: 'GET',
    path: prependAPI('me/player/devices')
  }
});

export const playerPlay = () => ({
  options: {
    method: 'PUT',
    path: prependAPI('me/player/play')
  }
});

export const playerPause = () => ({
  options: {
    method: 'PUT',
    path: prependAPI('me/player/pause')
  }
});

export const playerPlayPause = (action, state) => {
  const isPlaying = get(state, 'spotifyPlayer.is_playing');
  const path = isPlaying ? 'pause' : 'play';

  return {
    options: {
      method: 'PUT',
      path: prependAPI(`me/player/${path}`)
    }
  };
};

export const transferPlayback = ({ deviceIds, play }) => ({
  options: {
    method: 'PUT',
    path: prependAPI('me/player')
  },
  body: {
    device_ids: deviceIds,
    play
  }
});

export const usersPlaylists = ({ userId }) => ({
  type: EMIT_SPOTIFY_PLAYLISTS_UPDATE,
  options: {
    method: 'GET',
    path: prependAPI(`users/${userId}/playlists`)
  }
});
