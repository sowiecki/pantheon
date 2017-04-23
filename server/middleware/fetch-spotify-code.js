import { EMIT_REGISTER_SPOTIFY_TOKENS } from 'ducks/devices';

const fetchSpotifyCode = (store, action, next) => {
  const { spotifyApi } = store.getState().meta;

  spotifyApi.authorizationCodeGrant(action.code).then(({ body }) => {
    spotifyApi.setAccessToken(body.access_token);
    spotifyApi.setRefreshToken(body.refresh_token);

    next({
      type: EMIT_REGISTER_SPOTIFY_TOKENS,
      spotifyAccessToken: body.access_token,
      spotifyRefreshToken: body.refresh_token
    });
  }, (error) => {
    console.log('Problem setting Spotify authentication code!', error); // eslint-disable-line
  });
};

export default fetchSpotifyCode;
