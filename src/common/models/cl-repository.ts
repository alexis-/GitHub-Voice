import Issue from '~/models/issue';
import RepositoryBase from '~/models/repository-base';

export default class Repository extends RepositoryBase {
  issues: Array<Issue>;

  constructor()
  constructor(orgAndRepo: string, displayName: string, issues: Array<Issue>)
  constructor(orgAndRepo?: string, displayName?: string, issues?: Array<Issue>) {
    super(orgAndRepo || '', displayName || '');

    this.issues = issues || [];
  }
}
