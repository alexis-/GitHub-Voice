const express = require('express');
const { resolve } = require('path');
const history = require('connect-history-api-fallback');

const { NODE_ENV = 'development' } = process.env;

// SPA static files
const publicPath = resolve('dist/');
const staticConf = { maxAge: '1y', etag: false };

const router = module.exports = express.Router();

// Add Access-Token header when loading the SPA client
/* router.use('/',
  (req, res, next) => {
    // console.log(req.session);

    if (req.isAuthenticated) {
      res.setHeader('Access-Token', req.session.accessToken);
    }

    next();
  },
); */

// SPA client routes & static assets
if (NODE_ENV.trim() === 'production') {
  router.use(express.static(publicPath, staticConf));
  router.use('/', history());
}
