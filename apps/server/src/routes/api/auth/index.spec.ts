import routes from '@mathemon/turbo-server/test-utils/routes.js';

import router from './index.js';

routes(router, '/api/auth', ['/tokens']);
