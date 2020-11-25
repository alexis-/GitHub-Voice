const config = require('config');

module.exports = () => {
  global.cfg = config;

  process.env.VUE_APP_TITLE = config.client.appTitle;
  process.env = { ...process.env, ...config.client };
};
