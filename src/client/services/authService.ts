import axios from 'axios';

const httpClient = axios.create({
  baseURL: process.env.apiBaseUrl,
  headers: { Accept: 'application/json' },
});

export default {
  signIn() {
    return httpClient.get('/auth');
  },
  signOut() {
    return httpClient.get('/auth/logout');
  },
  getUser() {
    return httpClient.get('/auth/user');
  },
};
