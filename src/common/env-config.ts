const config: GHConfig = require('config');

// @ts-ignore: noImplicitAny
const addToVueEnv = ([key, value]) =>
  process.env[`VUE_APP_${toVueEnvKey(key as string)}`] = (value as Object).toString();

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

global.cfg = config;

// Setup common urls & paths
config.common.apiUrl = ensureTrailingSlash(config.common.apiUrl);
config.common.webUrl = ensureTrailingSlash(config.common.webUrl);

const apiUrl = new URL(config.common.apiUrl);
const webUrl = new URL(config.common.webUrl);

config.common.apiOrigin = apiUrl.origin;
config.common.webOrigin = webUrl.origin;
config.common.apiHost = apiUrl.hostname;
config.common.webHost = webUrl.hostname;
config.common.apiPath = apiUrl.pathname;
config.common.webPath = webUrl.pathname;

// config.client.apiHost = ensureTrailingSlash(config.client.apiHost);
// config.client.apiBaseUrl = config.client.apiHost + config.server.apiPath.substr(1);

// Write client config to Vue environment variables (https://cli.vuejs.org/guide/mode-and-env.html)
Object.entries(config.common).forEach(addToVueEnv);
Object.entries(config.client).forEach(addToVueEnv);

export default config;
