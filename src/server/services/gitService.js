const axios = require('axios');

const httpClient = axios.create({
  baseURL: 'https://api.github.com',
  headers: { Accept: 'application/vnd.github.v3+json' },
});

const authorizationToken = () => Buffer
  .from(`${global.cfg.server.gitHubClientId}:${global.cfg.server.gitHubClientSecret}`)
  .toString('base64');

const listIssues = (orgAndRepo) => httpClient.get(`/repos/${orgAndRepo}/issues?state=open`,
  {
    headers: {
      Accept: 'application/vnd.github.squirrel-girl-preview',
      Authorization: `Basic ${authorizationToken()}`,
    },
  });

module.exports = { listIssues };
