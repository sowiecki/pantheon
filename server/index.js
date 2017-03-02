/* eslint no-console:0 */
/* globals console */
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import colors from 'colors/safe';

import { logger } from 'utils';
import router from './routes';
import controllers from './controllers';

const server = new Koa();
const port = process.env.PORT || 4000;

server.use(bodyParser({ multipart: true }));
server.use(router.routes());

const run = async () => {
  logger.log('info', `Listening on port ${port}`);

  Object.keys(controllers).forEach((key) => {
    const shouldInit = controllers[key].shouldInit();
    const hasInitializeMethod = typeof controllers[key].initialize === 'function';

    if (shouldInit && hasInitializeMethod) {
      const controllerName = colors.bold(controllers[key].displayName);
      logger.log('info', `Initializing ${controllerName}`);

      try {
        controllers[key].initialize();

        logger.log('info', `${controllerName} initialization: ${colors.bgGreen.bold('success')}`);
      } catch (e) {
        logger.log('info', `${controllerName} initialization: ${colors.bgRed.bold('failure')}`);
        logger.log('error', e);
      }
    }
  });

  await server.listen(port);
};

run();
