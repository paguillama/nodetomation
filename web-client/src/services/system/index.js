import 'angular-bootstrap';
import '../common';

import NodetoSystemService from './system-service';

export default angular
  .module('NodetoSystemModule', [
    'ui.bootstrap',
    'NodetoCommonModule'
  ])
  .factory('NodetoSystemService', ($http, $q, $timeout, $modal, API_ROOT, NodetoMessageService) => new NodetoSystemService($http, $q, $timeout, $modal, API_ROOT, NodetoMessageService));