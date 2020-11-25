const express = require('express');

const { setupServer, runTasks } = require('./config');

const { port = 3000 } = global.cfg.server;
const app = express();

setupServer(app);
runTasks();

// Go
app.listen(port, () => console.log(`App running on port ${port}!`));
