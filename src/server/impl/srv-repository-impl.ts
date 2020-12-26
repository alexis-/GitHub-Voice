import { AxiosResponse } from 'axios';

import cache, { cacheCfg } from '@/stores/cache-store';

import Repository from '@/models/srv-repository';
import gitSvc from '@/services/gitService';
import Issue from '~/models/issue';

declare module '@/models/srv-repository' {
  export default interface Repository {
    getETagAsync(): Promise<string>;
    setETagAsync(value: string): Promise<any>;

    getIssuesAsync(): Promise<Array<Issue>>;
    setIssuesAsync(value: Array<Issue>): Promise<any>;

    updateETagAsync(eTag: string): Promise<boolean>;
    updateWithResp(issuesResp: AxiosResponse<Array<Issue>>): Promise<boolean>;
    updateFromApi():Promise<boolean>;
  }
}

Repository.prototype.getETagAsync = function (): Promise<string> {
  return cache.get(this.eTagCacheKey);
};

Repository.prototype.setETagAsync = function (value: string): Promise<any> {
  return cache.set(this.eTagCacheKey, value, cacheCfg);
};

Repository.prototype.getIssuesAsync = function (): Promise<Array<Issue>> {
  return cache.get(this.issuesCacheKey);
};

Repository.prototype.setIssuesAsync = function (value: Array<Issue>): Promise<any> {
  return cache.set(this.issuesCacheKey, value, cacheCfg);
};

Repository.prototype.updateETagAsync = async function (eTag: string): Promise<boolean> {
  const curETag = await this.getETagAsync();

  if (eTag === curETag) {
    return false;
  }

  await this.setETagAsync(eTag);
  return true;
};

Repository.prototype.updateWithResp = async function (issuesResp: AxiosResponse<Array<Issue>>): Promise<boolean> {
  if (await this.updateETagAsync(issuesResp.headers.etag) === false) {
    return false;
  }

  await this.setIssuesAsync(issuesResp.data);
  console.debug(`Saved issues for repository ${this.orgAndRepo}`);

  return true;
};

Repository.prototype.updateFromApi = async function ():Promise<boolean> {
  try {
    const issuesResp = await gitSvc.listIssuesAsync(this.orgAndRepo);

    return issuesResp == null
      ? false
      : await this.updateWithResp(issuesResp);
  } catch (err) {
    console.warn(err);
    return false;
  }
};
