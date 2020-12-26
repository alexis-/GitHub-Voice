require('ts-node').register({
  project: './tsconfig.server.json',
  require: ['tsconfig-paths/register'],
});

module.exports = require('./vue.config.ts');
