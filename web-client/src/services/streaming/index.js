import '../common';
import NodetoStreamingService from './streaming-service';

export default angular
  .module('NodetoStreamingServiceModule', ['NodetoCommonModule'])
  .factory('NodetoStreamingService', ($http, API_ROOT) => new NodetoStreamingService($http, API_ROOT));