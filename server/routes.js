import Router from 'koa-router';

import { hueController, buzzerController } from './controllers';

const router = new Router();

router.get('/on', () => hueController.on());
router.get('/off', () => hueController.off());

router.post('/buzzer', () => buzzerController.buzz());

export default router;
