import { Moment } from 'moment';

import Label from './label';
import Reactions from './reaction';
import Repository from './cl-repository';

export default class Issue {
  constructor(issue: any) {
    this.number = issue.number;
    this.title = issue.title;
    this.comments = issue.comments;
    this.created_at = issue.created_at;
    this.labels = issue.labels;
    this.reactions = new Reactions(issue.reactions);
  }

  number: number;
  title: string;
  comments: number;

  /* eslint-disable camelcase */
  created_at: string | Moment;

  labels: Array<Label>;
  reactions: Reactions;

  repo: Repository | null;

  get url(): string {
    return `https://github.com/${(this.repo as Repository).orgAndRepo}/issues/${this.number}`;
  }
}
