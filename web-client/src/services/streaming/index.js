import '../common';
import NodetoStreamingService from './streaming-service';

export default angular
  .module('NodetoStreamingServiceModule', ['NodetoCommonModule'])
  .factory('NodetoStreamingService', ($http, API_ROOT, STREAMING_ROOT, NodetoAuthenticationService) => new NodetoStreamingService($http, API_ROOT, STREAMING_ROOT, NodetoAuthenticationService));