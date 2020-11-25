const fs = require('fs');
const path = require('path');
const { asyncParallelForEach } = require('async-parallel-foreach');
const { listIssues } = require('../services/gitService');
const Repository = require('../models/repository');

const repositoryMap = {};

const getAllRepoIssuesFilePath = () => path.join(global.cfg.server.dataPath, 'allRepoIssues.json');

const getOrCreateRepo = ({ orgAndRepo, displayName }) => {
  if (orgAndRepo in repositoryMap) {
    return repositoryMap[orgAndRepo];
  }

  const repo = repositoryMap[orgAndRepo] = new Repository(orgAndRepo, displayName);

  return repo;
};

const processAndSaveRepoIssues = (repo, issuesResp) => {
  if (issuesResp.status !== 200) {
    console.warn(`Failed to download issues from ${repo.orgAndRepo} (status ${issuesResp.status})`);
    return false;
  }

  if (repo.updateETag(issuesResp.headers.etag) === false) {
    return false;
  }

  fs.writeFileSync(repo.filePath, JSON.stringify(issuesResp.data));
  console.debug(`Saved issues for repository ${repo.orgAndRepo}`);

  return true;
};

const getAllRepoIssues = () => asyncParallelForEach(
  global.cfg.repositories, 5,
  async (cfgRepo, _idx) => {
    try {
      const repo = getOrCreateRepo(cfgRepo);
      const issuesJson = await listIssues(repo.orgAndRepo);

      return processAndSaveRepoIssues(repo, issuesJson);
    } catch (err) {
      console.warn(err);
      return false;
    }
  }, {
    times: 3,
    interval: 500,
  },
);

const processAndSaveAllRepoIssues = () => {
  const allRepoIssuesFilePath = getAllRepoIssuesFilePath();
  const allRepoIssues = {};

  Object.entries(repositoryMap).forEach(([key, repo]) => {
    const jsonText = fs.readFileSync(repo.filePath);

    allRepoIssues[repo.displayName] = JSON.parse(jsonText);
  });

  fs.writeFileSync(allRepoIssuesFilePath, JSON.stringify(allRepoIssues));
  console.debug('Saved all processed issues to file.');
};

const pullIssues = () => {
  getAllRepoIssues().then((hasNewDataArray) => {
    if (hasNewDataArray.some((hasNewData) => hasNewData.value)) {
      processAndSaveAllRepoIssues();
    }
  }).catch(console.warn);
};

module.exports = pullIssues;
