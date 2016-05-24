import '../common';
import NodetoLogsService from './logs-service';

export default angular
  .module('NodetoLogsModule', ['NodetoCommonModule'])
  .factory('NodetoLogsService', ($http, $q, API_ROOT) => new NodetoLogsService($http, $q, API_ROOT));