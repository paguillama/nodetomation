/**
 * @ngdoc service
 * @name NodetoLiveCommunicationModule.NodetoLiveCommunicationService
 *
 * @description
 * Manages application live communication channels.
 * Uses socket.io to communicate with the server.
 *
 * @requires socketFactory
 **/
export default class NodetoLiveCommunicationService {

  constructor(socketFactory) {
    this.socketFactory = socketFactory;
  }

  /**
   * @ngdoc method
   * @name subscribeScope
   * @methodOf NodetoLiveCommunicationModule.NodetoLiveCommunicationService
   *
   * @description
   * Subscribes scope callbacks to a channel.
   * It also removes the socket io listener on scope destroy.
   *
   * @param {string} channel Channel to subscribe.
   * @param {Scope} scope Scope to subscribe.
   * @param {Function} callback Callback function to subscribe.
   *
   * @returns {Promise} Promise with all the streaming items
   */
  subscribeScope (channel, scope, callback) {
    /* globals io */
    var ioSocket = io.connect();

    var socket = this.socketFactory({ ioSocket: ioSocket });

    socket.on(channel, callback);
    scope.$on('$destroy', function () {
      socket.removeListener(callback);
      ioSocket.disconnect();
    });
  }
}