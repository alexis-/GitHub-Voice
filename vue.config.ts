/* eslint-disable global-require */
const path = require('path');

require('./src/common/global');
require('./src/common/env-config')();

module.exports = {
  outputDir: './dist/client',
  configureWebpack: {
    devtool: 'source-map',
    resolve: {
      alias: {
        '@': path.join(__dirname, 'src/client/'),
        '~': path.join(__dirname, 'src/common/'),
      },
    },
    entry: {
      app: path.join(__dirname, 'src/client/', 'main.ts'),
    },
  },
  /* devServer: {
    before: (app) => require('./src/server/config').configServer(app),
    after: (_app, _server, _compiler) => require('./src/server/config').runTasks(),
  }, */
};
