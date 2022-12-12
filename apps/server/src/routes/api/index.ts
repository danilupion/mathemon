import { StatusCode } from '@mathemon/common/rest/http.js';
import { Router } from 'express';

const router = Router();

router.use('*', (_, res) => {
  res.sendStatus(StatusCode.ServerErrorNotImplemented);
});

export default router;
