import axios, { AxiosInstance, AxiosResponse } from 'axios';
import * as crypto from 'crypto';

import Issue from '~/models/issue';

const httpClient: AxiosInstance = axios.create({
  baseURL: 'https://api.github.com',
  headers: { Accept: 'application/vnd.github.v3+json' },
});

const authorizationToken = () => Buffer
  .from(`${global.cfg.server.gitHubClientId}:${global.cfg.server.gitHubClientSecret}`)
  .toString('base64');

export default {
  async listIssuesAsync(orgAndRepo: string) {
    const per_page = 100;
    let hasMore = true;
    let page = 1;

    let issues: Issue[] = [];
    const eTags = [];

    let axiosResp: AxiosResponse<Issue[]> = null!;

    while (hasMore) {
      axiosResp = await httpClient.get<Array<Issue>>(
        `/repos/${orgAndRepo}/issues?state=open&per_page=${per_page}&page=${page}`,
        {
          headers: {
            Accept: 'application/vnd.github.squirrel-girl-preview',
            Authorization: `Basic ${authorizationToken()}`,
          },
        },
      );

      if (axiosResp.status !== 200) {
        console.warn(`Failed to download issues from ${orgAndRepo} (status ${axiosResp.status})`);
        return null;
      }

      const respIssues = axiosResp.data.map((i) => new Issue(i));
      issues = issues.concat(respIssues);

      eTags.push(axiosResp.headers.etag);

      hasMore = respIssues.length >= per_page;
      page++;
    }

    axiosResp.headers.etag = crypto.createHash('sha512').update(eTags.join()).digest('hex');
    axiosResp.data = issues;

    return axiosResp;
  },
};
