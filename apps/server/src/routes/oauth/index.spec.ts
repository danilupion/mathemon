import routes from '@danilupion/turbo-server/test-utils/routes.js';

import router from './index.js';

routes(router, '/oath', ['/facebook', '/google', '/*']);
