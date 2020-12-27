import { Moment } from 'moment';

import User from './user';

export default class Reaction {
  constructor(reaction: any) {
    this.id = reaction.id;
  }

  id: number;
  content: string;
  user: User;

  /* eslint-disable camelcase */
  created_at: string | Moment;
}
