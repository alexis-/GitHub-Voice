import express from 'express';
import cors from 'cors';
import session from 'express-session';
import cron from 'node-cron';
import path from 'path';
import fs from 'fs';
import tldjs from 'tldjs';

const FileStore = require('session-file-store')(session);

import appRoute from '@/routes/app';
import authRoute from '@/routes/auth';
import issuesRoute from '@/routes/issues';

import repoStore from '@/stores/repository-store';

function getApiPath(apiEndpoint: string) {
  return global.cfg.common.apiPath + apiEndpoint;
}

function getRootDomain(webUrl: string) {
  const parsed = tldjs.parse(webUrl);

  if (parsed.isValid === false) {
    throw new Error(`Invalid config value for webUrl: '${webUrl}'`);
  }

  return [ parsed.hostname, parsed.publicSuffix ].includes('localhost')
    ? 'localhost'
    : tldjs.getDomain(webUrl);
}

const oneYear = 60000 * 60 * 24 * 365;
const cookiesDomain = getRootDomain(global.cfg.common.webUrl);
const corsOptions: cors.CorsOptions = {
  origin: global.cfg.server.cors,
  credentials: true,
};

export const configServer = (app : express.Application) => {
  app.use(session({
    cookie: {
      domain: cookiesDomain || '',
      maxAge: oneYear,
    },
    resave: false,
    store: new FileStore({
      path: path.resolve(global.cfg.server.sessionsPath),
      secret: global.cfg.server.sessionsSecret,
      ttl: oneYear,
    }),
    saveUninitialized: false,
    secret: global.cfg.server.sessionsSecret,
  }));

  app.use(cors(corsOptions));
  app.use(getApiPath('auth'), authRoute);
  app.use(getApiPath('issues'), issuesRoute);
  app.use('/', appRoute);
};

export const initialize = () => {
  repoStore.initialize(global.cfg.repositories);

  const dataPath = path.resolve(global.cfg.server.dataPath);

  if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(dataPath);
  }

  repoStore.updateFromApi();

  // TODO: Synchronize with updateFromApi (it's running asynchrnonously)
  cron.schedule('0 * * * * *', () => repoStore.updateFromApi());
};
