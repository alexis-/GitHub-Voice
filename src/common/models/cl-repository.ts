import { timeStamp } from 'console';
import Issue from '~/models/issue';
import RepositoryBase from '~/models/repository-base';

export default class Repository extends RepositoryBase {
  issues: Array<Issue>;
  isDisplayed: boolean = true;

  constructor()
  constructor(orgAndRepo: string, displayName: string, issues: Array<Issue>)
  constructor(orgAndRepo?: string, displayName?: string, issues?: any) {
    super(orgAndRepo || '', displayName || '');

    if (issues as Array<Issue>) {
      this.issues = issues.map((i: Issue) => new Issue(i));
    } else if (issues as Object) {
      this.issues = Object.keys(issues).map((i: any, _idx: number) => new Issue(i));
    } else {
      this.issues = [];
    }
  }
}
