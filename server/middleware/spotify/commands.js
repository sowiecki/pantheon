import { SPOTIFY_API } from 'constants';
import { EMIT_REGISTER_SPOTIFY_DEVICES } from 'ducks/occurrences';

const appendAPI = (path) => `${SPOTIFY_API}${path}`;

export const playerDevices = () => ({
  options: {
    method: 'GET',
    path: appendAPI('me/player/devices')
  },
  type: EMIT_REGISTER_SPOTIFY_DEVICES
});

export const playerPlay = () => ({
  options: {
    method: 'PUT',
    path: appendAPI('me/player/play')
  }
});

export const playerPause = () => ({
  options: {
    method: 'PUT',
    path: appendAPI('me/player/pause')
  }
});

export const transferPlayback = ({ deviceIds, play }) => ({
  options: {
    method: 'PUT',
    path: appendAPI('me/player')
  },
  body: {
    device_ids: deviceIds,
    play
  }
});

export const usersPlaylists = ({ userId }) => ({
  options: {
    method: 'GET',
    path: appendAPI(`users/${userId}/playlists`)
  } // TODO add type, do stuff with playlists
});
