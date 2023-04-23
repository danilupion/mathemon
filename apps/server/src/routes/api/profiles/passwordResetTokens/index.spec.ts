import { Method } from '@danilupion/turbo-server/http.js';
import routes from '@danilupion/turbo-server/test-utils/routes.js';

import router from './index.js';

routes(router, '/api/profiles/passwordTokns', [
  [Method.POST, '/'],
  [Method.PUT, '/'],
]);
