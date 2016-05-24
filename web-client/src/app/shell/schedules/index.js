import 'angular';
import 'angular-ui-router';
import 'angular-cron-jobs';
import '../../../components/nodeto-message';

import '../../../services/schedule';
import '../../../services/system';

import NodetoSchedulesController from './schedules-controller';

export default angular
  .module('NodetoSchedulesModule', [
    'ui.router',
    'angular-cron-jobs',
    'NodetoMessageModule',

    'NodetoScheduleModule',
    'NodetoSystemModule'
  ]).config($stateProvider => {
    $stateProvider.state('schedules', {
      parent: 'shell',
      url: '/schedules',
      views: {
        'detail': {
          controller: NodetoSchedulesController,
          controllerAs: 'ctrl',
          templateUrl: 'app/shell/schedules/schedules-tpl.html'
        }
      }
    });
  })
  .controller('NodetoSchedulesController', NodetoSchedulesController);