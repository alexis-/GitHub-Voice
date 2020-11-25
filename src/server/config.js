const session = require('express-session');
const sessionFileStore = require('session-file-store');
const cron = require('node-cron');
const fs = require('fs');

const appRoute = require('./routes/app');
const authRoute = require('./routes/auth');
const issuesRoute = require('./routes/issues');

const pullIssues = require('./tasks/pull-issues');

const FileStore = sessionFileStore(session);

module.exports = {
  configServer: (app) => {
    app.use(session({
      cookie: {
        maxAge: 60000 * 60 * 24 * 365, // 1 year
      },
      resave: false,
      store: new FileStore({}),
      saveUninitialized: false,
      secret: global.cfg.server.sessionSecret,
    }));

    app.use('/auth', authRoute);
    app.use('/issues', issuesRoute);
    app.use('/', appRoute);
  },
  runTasks: () => {
    const { dataPath } = global.cfg.server;

    if (!fs.existsSync(dataPath)) {
      fs.mkdirSync(dataPath);
    }

    pullIssues();

    cron.schedule('0 * * * * *', pullIssues);
  },
};
