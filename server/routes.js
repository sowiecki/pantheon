import Router from 'koa-router';
import send from 'koa-send';
import queryString from 'query-string';

import getEventHandlers from 'handlers';
import { SPOTIFY_TOKEN_REFRESH_INVERVAL } from 'constants';
import { ENV, PUBLIC_DIR } from 'config';
import {
  FETCH_SPOTIFY_CODE,
  EMIT_REFRESH_SPOTIFY_CODE
} from 'ducks/devices';
import store from 'store';
import { setResponse, errorNoHandler, filterSensativeState, getHueStates } from 'utils';

const router = new Router();

const isAuthorized = (ctx) => ctx.request.headers.id === ENV.id;

router.post('/api/state', async (ctx) => {
  if (isAuthorized(ctx)) {
    const hueStates = await getHueStates(store);
    const metaState = store.getState().meta;

    setResponse({ next: ctx }, 200);
    ctx.body = filterSensativeState({ hueStates, ...metaState });
  } else {
    setResponse({ next: ctx }, 403);
  }
});

router.post('/api', (ctx) => {
  if (isAuthorized(ctx)) {
    const handlers = getEventHandlers(ctx.request);
    const eventHandler = handlers[ctx.request.header.event];

    if (eventHandler) {
      eventHandler();
      setResponse({ next: ctx }, 200);
    } else {
      errorNoHandler(ctx.headers.event);
      setResponse({ next: ctx }, 500);
    }
  } else {
    setResponse({ next: ctx }, 403);
  }
});

router.get('/api/register-spotify', async (ctx) => {
  const code = queryString.parse(ctx.request.url)['/api/register-spotify?code'];

  store.dispatch({
    type: FETCH_SPOTIFY_CODE,
    code
  });

  setInterval(() => store.dispatch({
    type: EMIT_REFRESH_SPOTIFY_CODE
  }), SPOTIFY_TOKEN_REFRESH_INVERVAL);

  await send(ctx, '/spotify-auth.html', { root: PUBLIC_DIR });
});


export default router;
