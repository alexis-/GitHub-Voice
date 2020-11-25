const express = require('express');
const path = require('path');

const router = module.exports = express.Router();

// eslint-disable-next-line no-confusing-arrow
const getAllRepoIssuesFilePath = () => path.resolve(path.join(global.cfg.server.dataPath, 'allRepoIssues.json'));

router.get('/', (req, resp) => {
  resp.sendFile(getAllRepoIssuesFilePath());
});
