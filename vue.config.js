const path = require('path');

require('./src/server-env-config')();
const { configServer, runTasks } = require('./src/server/config');

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
    before: (app) => {
      configServer(app);
    },
    after: (_app, _server, _compiler) => runTasks(),
  },
};
