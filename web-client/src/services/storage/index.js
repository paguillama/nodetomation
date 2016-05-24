import NodetoStorageService from './storage-service';

export default angular
  .module('NodetoStorageModule', [])
  .factory('NodetoStorageService', $window => new NodetoStorageService($window));