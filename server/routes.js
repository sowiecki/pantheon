import Router from 'koa-router';

import { hueController } from './controllers';

const router = new Router();

router.get('/', (ctx, next) => {
  console.log('Hello, world!');
})

router.get('/on', (ctx, next) => hueController.on());
router.get('/off', (ctx, next) => hueController.off());

export default router;
