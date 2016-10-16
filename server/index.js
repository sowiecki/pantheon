/* eslint no-console:0 */
/* globals console */
import Koa from 'koa';
import colors from 'colors/safe';

import router from './routes';
import * as controllers from './controllers';

import { getControllerName } from 'utils';

const server = new Koa();
const port = process.env.PORT || 4000;

server.use(router.routes());

const run = async() => {
  console.log(`Listening on port ${port}`);

  Object.keys(controllers).forEach((key) => {
    const hasInitializeMethod = typeof controllers[key]().initialize === 'function';
    const controllerName = colors.bold(getControllerName(controllers[key]));

    if (hasInitializeMethod) {
      console.log(`Initializing ${controllerName}`);

      try {
        controllers[key]().initialize();

        console.log(`${controllerName} initialization: ${colors.bgGreen.bold('success')}`);
      } catch (e) {
        console.log(`${controllerName} initialization: ${colors.bgRed.bold('fail')}`);
      }
    }
  });

  await server.listen(port);
};

run();
