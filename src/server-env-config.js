const config = require('config');

/**
 * @param {string} key
 */
const toVueEnvKey = (key) => key
  .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
  .replace(/([A-Z])([A-Z])(?=[a-z])/g, '$1_$2')
  .toUpperCase();

module.exports = () => {
  global.cfg = config;

  // Fix server.apiPath
  if (config.server.apiPath) {
    let { apiPath } = config.server;

    if (apiPath[0] !== '/') apiPath = `/${apiPath}`;
    if (apiPath[apiPath.length - 1] !== '/') apiPath = `${apiPath}/`;

    config.server.apiPath = apiPath;
  } else {
    config.server.apiPath = '/';
  }

  // Write client config to Vue environment variables (https://cli.vuejs.org/guide/mode-and-env.html)
  Object.entries(config.client).forEach(([key, val]) => {
    process.env[`VUE_APP_${toVueEnvKey(key)}`] = val;
  });
};
