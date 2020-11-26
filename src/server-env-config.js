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

  Object.entries(config.client).forEach(([key, val]) => {
    process.env[`VUE_APP_${toVueEnvKey(key)}`] = val;
  });
};
