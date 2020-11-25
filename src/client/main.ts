import Vue from 'vue';
import Axios from 'axios';

import theme from '@/plugins/theme';
import setupAxiosAuth from '@/plugins/authInterceptors';
import gitService from '@/services/gitService';

import router from '@/router';
import store from '@/store';

import App from './App.vue';

Vue.config.productionTip = false;

Vue.use(theme);

new Vue({
  router,
  store,
  render: (h) => h(App),

  beforeCreate() {
    this.$store.dispatch('auth/initializeStore');
  },
  created() {
    setupAxiosAuth(
      gitService.httpClient,
      () => `token ${this.$store.getters['auth/token']}`,
      () => this.$store.dispatch['auth/refreshToken'],
      () => this.$store.dispatch['auth/signOff'],
    );
  },
}).$mount('#app');
