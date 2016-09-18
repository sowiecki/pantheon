import Router from 'koa-router';

import { hueController, buzzerController, deadboltController } from 'controllers';

const router = new Router();

router.get('/on', () => hueController.on());
router.get('/off', () => hueController.off());

router.post('/buzzer', (next) => buzzerController(next).buzz());

router.post('/deadbolt', (next) => deadboltController(next).toggle());

export default router;
