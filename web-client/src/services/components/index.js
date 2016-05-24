import '../common';
import NodetoComponentsService from './components-service';

export default angular
  .module('NodetoComponentsModule', ['NodetoCommonModule'])
  .factory('NodetoComponentsService', ($http, $q, API_ROOT) => new NodetoComponentsService($http, $q, API_ROOT));