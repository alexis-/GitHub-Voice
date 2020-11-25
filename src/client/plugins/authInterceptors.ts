import { AxiosInstance } from 'axios';

interface Options {
  statusCodes: Number[],
}

const defaults: Options = {
  /** @type {Number[]} */
  statusCodes: [
    401, // Unauthorized
  ],
};

/**
 * https://raw.githubusercontent.com/Flyrell/axios-auth-refresh/master/src/index.js
 * Creates an authentication refresh interceptor that binds to any error response.
 * If the response code is 401, interceptor tries to call the refreshTokenCall which must return a Promise.
 * While refreshTokenCall is running, all new requests are intercepted and waiting for it to resolve.
 * After Promise is resolved/rejected the authentication refresh interceptor is revoked.
 * @param {AxiosInstance} axios - axios instance
 * @param {Function} refreshTokenCall - refresh token call which must return a Promise
 * @param {Object} options - options for the interceptor @see defaultOptions
 * @return {AxiosInstance}
 */
function createAuthRefreshInterceptor(axios: AxiosInstance, refreshTokenCall: Function, options: Options = defaults) {
  const id = axios.interceptors.response.use(
    (res) => res,
    (error) => {
      // Reject promise if the error status is not in options.ports or defaults.ports
      const statusCodes = options.statusCodes && options.statusCodes.length
        ? options.statusCodes
        : defaults.statusCodes;

      if (!error.response || (error.response.status && statusCodes.indexOf(+error.response.status) === -1)) {
        return Promise.reject(error);
      }

      // Remove the interceptor to prevent a loop
      // in case token refresh also causes the 401
      axios.interceptors.response.eject(id);

      const refreshCall = refreshTokenCall(error);

      // Create interceptor that will bind all the others requests
      // until refreshTokenCall is resolved
      const requestQueueInterceptorId = axios.interceptors.request.use((request) => refreshCall.then(() => request));

      // When response code is 401 (Unauthorized), try to refresh the token.
      return refreshCall
        .then(() => {
          axios.interceptors.request.eject(requestQueueInterceptorId);
          return axios(error.response.config);
        })
        .catch((refreshError) => {
          axios.interceptors.request.eject(requestQueueInterceptorId);
          return Promise.reject(refreshError);
        })
        .finally(() => createAuthRefreshInterceptor(axios, refreshTokenCall, options));
    },
  );
  return axios;
}

function setupAxiosAuth(
  axios: AxiosInstance,
  getTokenFunc: Function,
  refreshTokenFunc: Function,
  signedOffFunc: Function,
  options: Options = defaults) {
  axios.interceptors.request.use((req) => {
    req.headers.Authorization = getTokenFunc();
    return req;
  });

  axios.interceptors.response.use(
    (resp) => resp,
    (err) => {
      if (err.response.status === 401) {
        signedOffFunc();
      }

      return Promise.reject(err);
    },
  );

  // createAuthRefreshInterceptor(axios, refreshTokenFunc, options);

  return axios;
}

export default setupAxiosAuth;
