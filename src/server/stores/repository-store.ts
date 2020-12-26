import { asyncParallelForEach, ParallelResultArray, asyncOptions } from 'async-parallel-foreach';

import Repository from '@/models/srv-repository';
import ClientRepository from '~/models/cl-repository';
import Issue from '~/models/issue';
import '@/impl/srv-repository-impl';

import cache, { cacheCfg } from '@/stores/cache-store';

export class RepositoryStore {
  private repoIssuesCacheKey: string = `repoIssues_${Math.random()}`;
  private repositoriesDict: Record<string, Repository> = {};

  get all(): Repository[] {
    return Object.values(this.repositoriesDict);
  }

  // ClientRepository[]
  getRepoIssuesJsonAsync(): Promise<string> {
    return cache.get(this.repoIssuesCacheKey);
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

      await cache.set(this.repoIssuesCacheKey, JSON.stringify(allRepoIssues), cacheCfg);

      console.debug('Saved all processed issues to cache.');
    } catch (ex) {
      console.warn(ex);
    }
  }
}

export default new RepositoryStore();
