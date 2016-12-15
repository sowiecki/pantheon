import Router from 'koa-router';

import getStandardHandlers from 'handlers';
import { setResponse, getEventHandler, errorNoHandler } from 'utils';
import { config } from 'environment';

const router = new Router();

router.post('/api', (crx) => {
  const authorized = crx.request.headers.id === config.id;

  if (authorized) {
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
