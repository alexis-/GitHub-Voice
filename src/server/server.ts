import express from 'express';

require('~/env-config')();

import { configServer, initialize } from '@/config';

const { port = 3000 } = global.cfg.server;
const app = express();

configServer(app);
initialize();

// Go
app.listen(port, () => console.log(`App running on port ${port}!`));
