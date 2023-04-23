import { Method } from '@danilupion/turbo-server/http.js';
import routes from '@danilupion/turbo-server/test-utils/routes.js';

import router from './index.js';

routes(router, '/oauth/facebook', [
  [Method.GET, '/'],
  [Method.GET, '/callback'],
]);
