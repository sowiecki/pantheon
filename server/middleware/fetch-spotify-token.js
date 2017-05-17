import spotifyController from 'controllers/spotify';
import { SPOTIFY_TOKEN_REFRESH_INVERVAL } from 'constants';
import { EMIT_REGISTER_SPOTIFY_TOKENS } from 'ducks/devices';

const fetchSpotifyToken = (store, action, next) => {
  const { spotifyApi } = store.getState().meta;

  spotifyApi.authorizationCodeGrant(action.code).then(({ body }) => {
    spotifyApi.setAccessToken(body.access_token);
    spotifyApi.setRefreshToken(body.refresh_token);

    const refreshToken = () => next({
      type: EMIT_REGISTER_SPOTIFY_TOKENS,
      spotifyAccessToken: body.access_token,
      spotifyRefreshToken: body.refresh_token
    });

    refreshToken();

    setInterval(refreshToken, SPOTIFY_TOKEN_REFRESH_INVERVAL);

    spotifyController.syncState();
  }, (error) => {
    console.log('Problem setting Spotify authentication code!', error); // eslint-disable-line
  });
};

export default fetchSpotifyToken;
