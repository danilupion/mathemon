import { StatusCode } from '@danilupion/turbo-server/http.js';
import { Router } from 'express';

import verify from './verify/index.js';

const router = Router();

router.use('/verify', verify);

router.use('*', (_, res) => {
  res.sendStatus(StatusCode.ServerErrorNotImplemented);
});

export default router;
