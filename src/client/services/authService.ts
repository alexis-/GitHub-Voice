import axios from 'axios';

const httpClient = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
  headers: { Accept: 'application/json' },
});

export default {
  signInAsync() {
    return httpClient.get('/auth');
  },

  signOutAsync() {
    return httpClient.get('/auth/logout');
  },

  getUserAsync() {
    return httpClient.get('/auth/user');
  },
};
