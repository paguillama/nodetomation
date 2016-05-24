import 'angular-socket-io';
import NodetoLiveCommunicationService from './live-communication-service';

export default angular
  .module('NodetoLiveCommunicationModule', ['btford.socket-io'])
  .factory('NodetoLiveCommunicationService', socketFactory => new NodetoLiveCommunicationService(socketFactory));