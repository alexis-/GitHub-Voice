import express from 'express';

import { configServer, initialize } from '@/config';

require('~/env-config')();

const { port = 3000 } = global.cfg.server;
const app = express();

configServer(app);
initialize();

// Go
app.listen(port, () => console.log(`App running on port ${port}!`));
