import 'angular';
import 'angular-ui-router';

import './dashboard';
import './schedules';
import './system';
import './streaming';
import './about';

import '../../components/nodeto-message';
import '../../services/system';
import '../../services/authentication';

import NodetoShellController from './shell-controller';

export default angular
  .module('NodetoShellModule', [
    'ui.router',
    'NodetoSystemModule',
    'NodetoDashboardModule',
    'NodetoMessageModule',
    'NodetoSchedulesModule',
    'NodetoSystemLayoutModule',
    'NodetoStreamingModule',
    'NodetoAboutModule',
    'NodetoAuthenticationModule'
  ])
  .config(function config($stateProvider) {
    $stateProvider.state('shell', {
      abstract: true,
      views: {
        'main': {
          controller: NodetoShellController,
          controllerAs: 'shellCtrl',
          templateUrl: 'app/shell/shell-tpl.html'
        }
      }
    });
  })
  .controller('NodetoShellController', NodetoShellController);
