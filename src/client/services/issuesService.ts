import axios from 'axios';

const httpClient = axios.create({
  baseURL: process.env.apiBaseUrl,
  headers: { Accept: 'application/json' },
});

export default {
  list() {
    return httpClient.get('/issues');
  },
};
