import 'angular';
import 'angular-ui-router';
import '../../../services/system';
import '../../../services/logs';
import NodetoSystemController from './system-controller';

export default angular
  .module('NodetoSystemLayoutModule', [
    'ui.router',
    'NodetoSystemModule',
    'NodetoLogsModule'
  ]).config(function config($stateProvider) {
    $stateProvider.state('system', {
      parent: 'shell',
      url: '/system',
      views: {
        'detail': {
          controller: NodetoSystemController,
          controllerAs: 'ctrl',
          templateUrl: 'app/shell/system/system-tpl.html'
        }
      }
    });
  });