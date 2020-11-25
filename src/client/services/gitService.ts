import axios from 'axios';

const httpClient = axios.create({
  baseURL: 'https://api.github.com',
  headers: { Accept: 'application/vnd.github.v3+json' },
});

export default {
  httpClient,
  listIssues(userOrOrg: string, repo: string) {
    return httpClient.get(`/repos/${userOrOrg}/${repo}/issues`, {
      headers: { Accept: 'application/vnd.github.squirrel-girl-preview' },
    });
  },
  getReactions(url: string, reaction: string) {
    return httpClient.get(url, {
      headers: { Accept: 'application/vnd.github.squirrel-girl-preview' },
    });
  },
  addReaction(url: string, reaction: string) {
    return httpClient.post(url, {
      content: reaction,
    }, {
      headers: { Accept: 'application/vnd.github.squirrel-girl-preview' },
    });
  },
  delReaction(url: string, reactionId: number) {
    return httpClient.delete(`${url}/${reactionId}`, {
      headers: { Accept: 'application/vnd.github.squirrel-girl-preview' },
    });
  },
};
