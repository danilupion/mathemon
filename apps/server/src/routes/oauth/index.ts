import { ServerErrorStatusCode } from '@danilupion/turbo-server/http.js';
import { Router } from 'express';

import facebook from './facebook/index.js';
import google from './google/index.js';

const router = Router();

router.use('/facebook', facebook);
router.use('/google', google);

router.use('*', (_, res) => {
  res.sendStatus(ServerErrorStatusCode.ServerErrorNotImplemented);
});

export default router;
