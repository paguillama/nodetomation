import '../common';
import NodetoScheduleService from './schedule-service';

export default angular
  .module('NodetoScheduleModule', ['NodetoCommonModule'])
  .factory('NodetoScheduleService', ($http, API_ROOT) => new NodetoScheduleService($http, API_ROOT));