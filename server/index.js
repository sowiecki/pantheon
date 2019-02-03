/* eslint no-console:0 */
/* globals console */
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import colors from 'colors/safe';

import { PORT } from 'config';
import { logger } from 'utils';
import router from './routes';
import controllers from './controllers';
import Controller from './controllers/controller';

const server = new Koa();

server.use(bodyParser({ multipart: true }));
server.use(router.routes());

const run = async () => {
  Object.keys(controllers).forEach((key) => {
    const controller = new Controller(controllers[key]);
    const shouldInit = controller.shouldInit();
    const hasInitializeMethod = typeof controller.initialize === 'function';

    if (shouldInit && hasInitializeMethod) {
      const controllerName = colors.bold(controller.displayName);
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

  await server.listen(PORT);

  logger.log('info', `Listening on port ${PORT}`);
};

run();
