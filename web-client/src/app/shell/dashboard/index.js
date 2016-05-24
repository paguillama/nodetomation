import 'angular';
import 'angular-ui-router';
import '../../../services/components';
import '../../../services/schedule';
import '../../../services/live-communication';

import '../../../components/nodeto-switch';
import '../../../components/nodeto-message';
import '../../../components/nodeto-environment';

import NodetoDashboardController from './dashboard-controller';

export default angular
  .module('NodetoDashboardModule', [
    'ui.router',
    'NodetoComponentsModule',
    'NodetoScheduleModule',
    'NodetoLiveCommunicationModule',

    'NodetoSwitchModule',
    'NodetoMessageModule',
    'NodetoEnvironmentModule'
  ])
  .config($stateProvider => {
    $stateProvider.state('dashboard', {
      parent: 'shell',
      url: '/dashboard',
      views: {
        'detail': {
          controller: NodetoDashboardController,
          controllerAs: 'ctrl',
          templateUrl: 'app/shell/dashboard/dashboard-tpl.html'
        }
      }
    });
  })
  .controller('NodetoDashboardController', NodetoDashboardController);