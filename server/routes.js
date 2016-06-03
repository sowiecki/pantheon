import Router from 'koa-router';

import { hueController } from './controllers';

const router = new Router();

router.get('/on', () => hueController.on());
router.get('/off', () => hueController.off());

export default router;
