import { StatusCode } from '@mathemon/turbo-server/http.js';
import { Router } from 'express';

const router = Router();

router.use('*', (_, res) => {
  res.sendStatus(StatusCode.ServerErrorNotImplemented);
});

export default router;
