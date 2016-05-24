import 'angular';
import 'angular-ui-router';
import '../../../components/nodeto-streaming-tiles';
import '../../../services/streaming';
import NodetoStreamingController from './streaming-controller';

export default angular
  .module('NodetoStreamingModule', [
    'ui.router',
    'NodetoStreamingTilesModule',
    'NodetoStreamingServiceModule'
  ])
  .config($stateProvider => {
    $stateProvider.state('streaming', {
      parent: 'shell',
      url: '/streaming',
      views: {
        'detail': {
          controller: NodetoStreamingController,
          controllerAs: 'ctrl',
          templateUrl: 'app/shell/streaming/streaming-tpl.html'
        }
      }
    });
  });