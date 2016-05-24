import 'angular';
import 'angular-ui-router';
import '../../services/authentication';
import '../../components/nodeto-message';
import LoginController from './login-controller';

export default angular
  .module('NodetoLoginModule', [
    'ui.router',
    'NodetoAuthenticationModule',
    'NodetoMessageModule'
  ])
  .config($stateProvider => {
    $stateProvider
      .state('login', {
        url: '/login',
        views: {
          'main': {
            controller: LoginController,
            controllerAs: 'loginCtrl',
            templateUrl: 'app/login/login-tpl.html'
          }
        }
      });
  })
  .controller();