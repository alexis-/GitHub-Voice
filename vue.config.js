require('ts-node').register({
  project: './tsconfig.server.json',
});

module.exports = require('./vue.config.ts');
