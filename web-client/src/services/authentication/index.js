import '../common';
import '../storage';
import NodetoAuthenticationService from './authentication-service';
import NodetoAuthInterceptor from './authentication-interceptor';

export default angular
  .module('NodetoAuthenticationModule', [
    'NodetoCommonModule',
    'NodetoStorageModule'
  ])
  .factory('NodetoAuthenticationService', ($q, $http, API_ROOT, AUTH_USER_TOKEN_STORE_KEY, AUTH_USER_ID_STORE_KEY, AUTH_USER_USERNAME_STORE_KEY, NodetoStorageService) => new NodetoAuthenticationService($q, $http, API_ROOT, AUTH_USER_TOKEN_STORE_KEY, AUTH_USER_ID_STORE_KEY, AUTH_USER_USERNAME_STORE_KEY, NodetoStorageService))
  .factory('NodetoAuthInterceptor', ($q, $injector, NodetoStorageService, AUTH_USER_TOKEN_STORE_KEY) => new NodetoAuthInterceptor($q, $injector, NodetoStorageService, AUTH_USER_TOKEN_STORE_KEY))
  .config(($urlRouterProvider, $httpProvider) => {
    // default route
    $urlRouterProvider.otherwise('dashboard');
    $httpProvider.interceptors.push('NodetoAuthInterceptor');
  })
  .run(($rootScope, $state, NodetoAuthenticationService) => {
    // Prevents the state change to a forbidden one
    $rootScope.$on('$stateChangeStart', (event, next) => {
      if (!NodetoAuthenticationService.isLogged()) {
        if (next.name !== 'login') {
          event.preventDefault();
          $state.go('login');
        }
      } else {
        if (next.name === 'login') {
          $state.go('dashboard');
        }
      }
    });
  });