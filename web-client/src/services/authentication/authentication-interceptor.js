/**
 * @ngdoc service
 * @name NodetoAuthenticationModule.NodetoAuthInterceptor
 *
 * @description
 * Adds token and intercepts authentication statuses
 *
 * @requires $injector
 * @requires $q
 * @requires NodetoStorageService
 * @requires AUTH_USER_TOKEN_STORE_KEY
 **/
export default class NodetoAuthInterceptor {

  constructor($q, $injector, NodetoStorageService, AUTH_USER_TOKEN_STORE_KEY) {
    this.$q = $q;
    this.$injector = $injector;
    this.NodetoStorageService = NodetoStorageService;
    this.AUTH_USER_TOKEN_STORE_KEY = AUTH_USER_TOKEN_STORE_KEY;

    this.responseError = rejection => {
      if (rejection.status === 401) {
        $injector.get('$state').go('login');
      }
      return $q.reject(rejection);
    };

    this.request = config => {
      let token = this.NodetoStorageService.get(this.AUTH_USER_TOKEN_STORE_KEY);
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = 'Bearer ' + token;
      }

      return config;
    };

  }
}