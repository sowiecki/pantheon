import Router from 'koa-router';

import getEventHandlers from 'handlers';
import { setResponse, errorNoHandler, filterSensativeState, getHueStates } from 'utils';
import { config } from 'environment';
import store from 'store';

const router = new Router();

const isAuthorized = (ctx) => ctx.request.headers.id === config.id;

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

export default router;
