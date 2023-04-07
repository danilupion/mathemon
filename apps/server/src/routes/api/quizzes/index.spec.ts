import { Method } from '@mathemon/turbo-server/http.js';
import routes from '@mathemon/turbo-server/test-utils/routes.js';

import router from './index.js';

routes(router, '/api/quizzes', [
  [Method.POST, '/real'],
  [Method.POST, '/practice'],
]);
