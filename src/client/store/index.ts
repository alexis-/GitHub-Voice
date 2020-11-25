import Vue from 'vue';
import Vuex from 'vuex';

import AuthModule from './auth';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    signInModal: false,
  },
  getters: {
    isSignInModalDisplayed(state) {
      return state.signInModal;
    },
  },
  mutations: {
    TOGGLE_SIGN_IN_MODAL(state) {
      state.signInModal = !state.signInModal;
    },
  },
  modules: {
    auth: AuthModule,
  },
});
