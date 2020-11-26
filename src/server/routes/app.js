const express = require('express');
const { resolve } = require('path');
const history = require('connect-history-api-fallback');

const { NODE_ENV = 'development' } = process.env;

// SPA static files
const publicPath = resolve('dist/');
const staticConf = { maxAge: '1y', etag: false };

const router = module.exports = express.Router();

// SPA client routes & static assets
if (NODE_ENV.trim() === 'production' && global.cfg.server.serveStaticFiles) {
  router.use(express.static(publicPath, staticConf));
  router.use('/', history());
}
