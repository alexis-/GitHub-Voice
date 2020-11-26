import axios from 'axios';

const httpClient = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
  headers: { Accept: 'application/json' },
});

export default {
  list() {
    return httpClient.get('/issues');
  },
};
