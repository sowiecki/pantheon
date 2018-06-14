export const DEVICE_TYPES = ['hue', 'photons', 'httpRequests', 'unified'];

export const WEBSOCKET_PROTOCOL = 'protocolOne';
export const WEBSOCKET_REFRESH_INTERVAL = 1200000; // 20 minutes
export const WEBSOCKET_RECONNECT_INTERVAL = 2000; // 2 seconds

export const UNIFIED_REMOTE_PORT = 9510;
export const UNIFIED_KEEP_ALIVE_INTERVAL = 60000;

export const SPOTIFY_HOST = 'api.spotify.com';
export const SPOTIFY_API = '/v1/';
export const SPOTIFY_PERMISSION_SCOPES = [
  'playlist-read-private',
  'playlist-read-collaborative',
  'user-read-private',
  'user-read-playback-state',
  'user-read-email',
  'streaming',
  'user-top-read'
];

export const SPOTIFY_TOKEN_REFRESH_INVERVAL = 3300000; // 55 minutes
export const SPOTIFY_SYNC_STATE_TIMEOUT = 250;
