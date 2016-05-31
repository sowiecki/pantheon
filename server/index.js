/* eslint no-console:0 */
/* globals console */
import Koa from 'koa';

import router from './routes';
import * as controllers from './controllers';

const server = new Koa();
const port = process.env.PORT || 4000;

server.use(router.routes());

const run = async() => {
  console.log(`Listening on port ${port}`);

  Object.keys(controllers).forEach((key) => controllers[key].initialize());

  await server.listen(port);
};

run();
