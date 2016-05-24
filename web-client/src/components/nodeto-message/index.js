import NodetoMessageService from './nodeto-message-service';
import NodetoMessage from './nodeto-message-directive';

export default angular
  .module('NodetoMessageModule', [])
  .factory('NodetoMessageService', $timeout => new NodetoMessageService($timeout))
  .directive('nodetoMessage', () => new NodetoMessage());