import 'angular';
import 'angular-ui-router';

import NodetoAboutController from './about-controller';

export default angular
  .module('NodetoAboutModule', [
    'ui.router'
  ])
  .config($stateProvider => {
    $stateProvider.state('about', {
      parent: 'shell',
      url: '/about',
      views: {
        'detail': {
          controller: NodetoAboutController,
          controllerAs: 'ctrl',
          templateUrl: 'app/shell/about/about-tpl.html'
        }
      }
    });
  });