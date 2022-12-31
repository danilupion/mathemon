import { StatusCode } from '@mathemon/turbo-server/http.js';
import { Router } from 'express';

import google from './google/index.js';

const router = Router();

router.use('/google', google);

router.use('*', (_, res) => {
  res.sendStatus(StatusCode.ServerErrorNotImplemented);
});

export default router;
