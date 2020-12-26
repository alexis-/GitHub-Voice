/* eslint-disable global-require */
import path from 'path';

// VS code doesn't recognize alias, use full path to mute error
import './src/common/global';
import '~/env-config';

module.exports = {
  outputDir: './dist/client',
  publicPath: global.cfg.client.publicPath,
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
