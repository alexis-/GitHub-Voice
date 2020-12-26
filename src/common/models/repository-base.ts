export default class RepositoryBase {
  displayName: string;

  orgAndRepo: string;
  orgName: string = '';
  repoName: string = '';

  constructor()
  constructor(orgAndRepo: string, displayName: string)
  constructor(orgAndRepo?: string, displayName?: string) {
    this.displayName = displayName || '';
    this.orgAndRepo = orgAndRepo || '';

    if (orgAndRepo) {
      this.orgName = orgAndRepo.substring(0, orgAndRepo.indexOf('/'));
      this.repoName = orgAndRepo.substring(orgAndRepo.indexOf('/') + 1);
    }
  }
}
