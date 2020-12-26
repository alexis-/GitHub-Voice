import RepositoryBase from '~/models/repository-base';

export default class Repository extends RepositoryBase {
  eTagCacheKey: string;
  issuesCacheKey: string;

  constructor(orgAndRepo: string, displayName: string) {
    super(orgAndRepo, displayName);

    this.eTagCacheKey = `${this.orgAndRepo}_eTag`;
    this.issuesCacheKey = `${this.orgAndRepo}_issues`;
  }
}
