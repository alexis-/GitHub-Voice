import AuthAPI from '@/services/authService';

export default {
  namespaced: true,
  state: {
    isLoading: false,
    error: null,
    token: null,
    user: null,
  },
  getters: {
    isLoading(state) {
      return state.isLoading;
    },
    hasError(state) {
      return state.error !== null;
    },
    error(state) {
      return state.error;
    },
    isAuthenticated(state) {
      return state.user !== null;
    },
    token(state) {
      return state.token;
    },
    user(state) {
      return state.user;
    },
  },
  mutations: {
    AUTH_SUCCESS(state, { token, user }) {
      state.isLoading = false;
      state.error = null;
      state.isAuthenticated = true;
      state.user = user;
      state.token = token;

      console.debug(`Logged in as ${user}`);
      // console.log(user);
    },
    AUTH_FAILURE(state, error) {
      state.isLoading = false;
      state.error = error;
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;

      console.log(error);
    },
    AUTH_REFRESHING(state) {
      state.isLoading = true;
      state.isAuthenticated = true;
      state.user = null;
    },
  },
  actions: {
    refreshToken(context) {
      return null;
    },
    signOff({ commit }) {
      commit('AUTH_FAILURE');
    },
    initializeStore({ commit }) {
      commit('AUTH_REFRESHING');

      AuthAPI.getUser()
        .then((res) => commit('AUTH_SUCCESS', res.data))
        .catch((err) => commit('AUTH_FAILURE', err));
    },
  },
};
