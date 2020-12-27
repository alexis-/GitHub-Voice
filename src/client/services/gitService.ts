import axios from 'axios';

import Issue from '~/models/issue';
import Repository from '~/models/cl-repository';
import Reaction from '~/models/reaction';

const httpClient = axios.create({
  baseURL: 'https://api.github.com',
  headers: { Accept: 'application/vnd.github.v3+json' },
});

export default {
  httpClient,
  listIssues(repo: Repository) {
    return httpClient.get<Array<Issue>>(`/repos/${repo.orgAndRepo}/issues`, {
      headers: { Accept: 'application/vnd.github.squirrel-girl-preview' },
    });
  },
  getReactions(issue: Issue) {
    return httpClient.get<Array<Reaction>>(`/repos/${issue.repo!.orgAndRepo}/issues/${issue.number}/reactions`, {
      headers: { Accept: 'application/vnd.github.squirrel-girl-preview' },
    });
  },
  addReaction(issue: Issue, reaction: string) {
    return httpClient.post<Reaction>(`/repos/${issue.repo!.orgAndRepo}/issues/${issue.number}/reactions`, {
      content: reaction,
    }, {
      headers: { Accept: 'application/vnd.github.squirrel-girl-preview' },
    });
  },
  delReaction(issue: Issue, reactionId: number) {
    return httpClient.delete(`/repos/${issue.repo!.orgAndRepo}/issues/${issue.number}/reactions/${reactionId}`, {
      headers: { Accept: 'application/vnd.github.squirrel-girl-preview' },
    });
  },
};
