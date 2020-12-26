import express from 'express';
import cors from 'cors';
import session from 'express-session';
import cron from 'node-cron';
import path from 'path';
import fs from 'fs';

import appRoute from '@/routes/app';
import authRoute from '@/routes/auth';
import issuesRoute from '@/routes/issues';

import repoStore from '@/stores/repository-store';

const FileStore = require('session-file-store')(session);

const getApiPath = (apiEndpoint: string) => global.cfg.server.apiPath + apiEndpoint;
const corsOptions = {
  origin: global.cfg.server.cors,
};

export const configServer = (app : express.Application) => {
  app.use(session({
    cookie: {
      maxAge: 60000 * 60 * 24 * 365, // 1 year
    },
    resave: false,
    store: new FileStore({
      path: path.resolve(global.cfg.server.sessionsPath),
      secret: global.cfg.server.sessionsSecret,
    }),
    saveUninitialized: false,
    secret: global.cfg.server.sessionsSecret,
  }));

  app.use(getApiPath('auth'), cors(corsOptions), authRoute);
  app.use(getApiPath('issues'), cors(corsOptions), issuesRoute);
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
