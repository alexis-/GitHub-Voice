import axios from 'axios';

import Repository from '~/models/cl-repository';

const httpClient = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
  headers: { Accept: 'application/json' },
});

export default {
  listAsync() {
    return httpClient.get<Array<Repository>>('/issues');
  },
};
