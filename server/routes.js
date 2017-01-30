import Router from 'koa-router';

import getStandardHandlers from 'handlers';
import { setResponse, getEventHandler, errorNoHandler } from 'utils';
import { config } from 'environment';
import store from 'store';

const router = new Router();

const isAuthorized = (crx) => crx.request.headers.id === config.id;

router.post('/api/state', (crx) => {
  if (isAuthorized(crx)) {
    setResponse({ next: crx }, 200);

    crx.body = JSON.stringify(store.getState());
  } else {
    setResponse({ next: crx }, 403);
  }
});

router.post('/api', (crx) => {
  if (isAuthorized(crx)) {
    const handlers = getStandardHandlers(crx.request);
    const eventHandler = getEventHandler(crx.headers.event, handlers);

    if (eventHandler) {
      eventHandler();
      setResponse({ next: crx }, 200);
    } else {
      errorNoHandler(crx.headers.event);
      setResponse({ next: crx }, 500);
    }
  } else {
    setResponse({ next: crx }, 403);
  }
});

export default router;
