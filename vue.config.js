/* eslint-disable global-require */
const path = require('path');

require('./src/server-env-config')();

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.join(__dirname, 'src/client/'),
      },
    },
    entry: {
      app: path.join(__dirname, 'src/client/', 'main.ts'),
    },
  },
  devServer: {
    before: (app) => require('./src/server/config').configServer(app),
    after: (_app, _server, _compiler) => require('./src/server/config').runTasks(),
  },
};
