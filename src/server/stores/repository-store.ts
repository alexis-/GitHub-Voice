import { asyncParallelForEach, ParallelResultArray, asyncOptions } from 'async-parallel-foreach';
import * as crypto from 'crypto';

import Repository from '@/models/srv-repository';
import ClientRepository from '~/models/cl-repository';
import Issue from '~/models/issue';
import '@/impl/srv-repository-impl';

import cache, { cacheCfg } from '@/stores/cache-store';

export type JsonAndETag = {
  json: string,
  eTag: string,
};

export class RepositoryStore {
  private repoIssuesCacheKey: string = `repoIssues_${Math.random()}`;
  private repoIssuesEtagCacheKey: string = `repoIssues_eTag_${Math.random()}`;
  private repositoriesDict: Record<string, Repository> = {};

  get all(): Repository[] {
    return Object.values(this.repositoriesDict);
  }

  // ClientRepository[]
  async getRepoIssuesAsync(): Promise<JsonAndETag> {
    const json = await cache.get(this.repoIssuesCacheKey);
    const eTag = await cache.get(this.repoIssuesEtagCacheKey);

    return {
      json: json,
      eTag: eTag,
    };
  }

  initialize(repositories: GHConfigRepository[]) {
    repositories.forEach((ghRepo) => {
      this.repositoriesDict[ghRepo.orgAndRepo] = new Repository(
        ghRepo.orgAndRepo,
        ghRepo.displayName,
      );
    });
  }

  updateFromApi() : Promise<void> {
    const successFn = (hasNewDataArray: ParallelResultArray<boolean>) => {
      if (hasNewDataArray.some((hasNewData) => hasNewData.value) == false) return;

      return this.processAndSaveAllRepoIssuesAsync();
    };

    return asyncParallelForEach(
      this.all, 5,
      (repo: Repository, _idx: number) => repo.updateFromApi(),
      asyncOptions,
    ).then(successFn).catch(console.warn);
  }

  private async processAndSaveAllRepoIssuesAsync(): Promise<void> {
    const allRepoIssues: ClientRepository[] = [];

    try {
      await asyncParallelForEach(
        this.all, 5,
        async (repo: Repository, _idx: number) => {
          const issues = await repo.getIssuesAsync();

          const clientRepo = new ClientRepository(repo.orgAndRepo, repo.displayName, issues);

          allRepoIssues.push(clientRepo);
        }, asyncOptions,
      );

      const json = JSON.stringify(allRepoIssues);
      const eTag = crypto.createHash('sha512').update(json).digest('hex');

      await cache.set(this.repoIssuesCacheKey, json, cacheCfg);
      await cache.set(this.repoIssuesEtagCacheKey, eTag, cacheCfg);

      console.debug('Saved all processed issues to cache.');
    } catch (ex) {
      console.warn(ex);
    }
  }
}

export default new RepositoryStore();
