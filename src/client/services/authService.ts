import axios from 'axios';

const httpClient = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
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
