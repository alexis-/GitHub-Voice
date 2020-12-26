const config = require('config');

/**
 * @param {string} key
 */
const toVueEnvKey = (key: string) => key
  .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
  .replace(/([A-Z])([A-Z])(?=[a-z])/g, '$1_$2')
  .toUpperCase();

const ensureLeadingSlash = (url: string) => (url[0] !== '/')
  ? `/${url}`
  : url;

const ensureTrailingSlash = (url: string) => (url[url.length - 1] !== '/')
  ? `${url}/`
  : url;

module.exports = () => {
  global.cfg = config;

  // Fix server.apiPath
  if (config.server.apiPath) {
    config.server.apiPath = ensureLeadingSlash(config.server.apiPath);
    config.server.apiPath = ensureTrailingSlash(config.server.apiPath);
  } else {
    config.server.apiPath = '/';
  }

  config.client.apiHost = ensureTrailingSlash(config.client.apiHost);
  config.client.apiBaseUrl = config.client.apiHost + config.server.apiPath.substr(1);

  // Write client config to Vue environment variables (https://cli.vuejs.org/guide/mode-and-env.html)
  Object.entries(config.client).forEach(([key, val]) => {
    process.env[`VUE_APP_${toVueEnvKey(key)}`] = (<Object>val).toString();
  });
};
