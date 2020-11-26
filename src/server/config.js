const cors = require('cors');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const cron = require('node-cron');
const path = require('path');
const fs = require('fs');

const appRoute = require('./routes/app');
const authRoute = require('./routes/auth');
const issuesRoute = require('./routes/issues');

const pullIssues = require('./tasks/pull-issues');

const getApiPath = (apiEndpoint) => global.cfg.server.apiPath + apiEndpoint;
const corsOptions = {
  origin: global.cfg.server.cors,
};

module.exports = {
  configServer: (app) => {
    app.use(session({
      cookie: {
        maxAge: 60000 * 60 * 24 * 365, // 1 year
      },
      resave: false,
      store: new FileStore({
        path: path.resolve(global.cfg.server.sessionsPath),
        secret: global.cfg.server.sessionSecret,
      }),
      saveUninitialized: false,
      secret: global.cfg.server.sessionSecret,
    }));

    app.use(getApiPath('auth'), cors(corsOptions), authRoute);
    app.use(getApiPath('issues'), cors(corsOptions), issuesRoute);
    app.use('/', appRoute);
  },
  runTasks: () => {
    const dataPath = path.resolve(global.cfg.server.dataPath);

    if (!fs.existsSync(dataPath)) {
      fs.mkdirSync(dataPath);
    }

    pullIssues();

    cron.schedule('0 * * * * *', pullIssues);
  },
};
