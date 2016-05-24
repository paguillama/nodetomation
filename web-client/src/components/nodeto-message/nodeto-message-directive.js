/**
 * @ngdoc directive
 * @name NodetoMessageModule.directive:nodetoMessage
 *
 * @description
 * Shows multiple instant messages to the user.
 *
 * @scope
 * @restrict E
 *
 **/
export default class NodetoMessage {
  constructor() {
    this.templateUrl = 'components/nodeto-message/nodeto-message-tpl.html';
    this.replace = true;
    this.restrict = 'E';
    this.scope = {};

    this.controller = NodetoMessageController;
    this.controllerAs = 'ctrl';
    this.bindToController = true;
  }
}

class NodetoMessageController {
  constructor (NodetoMessageService) {
    /**
     * @ngdoc property
     * @name messages
     * @propertyOf NodetoMessageModule.directive:nodetoMessage
     *
     * @description
     * Stores the messages to show.
     * As the service uses always the same messages array the
     * UI will be automatically updated by the binding
     */
    this.messages = NodetoMessageService.getMessages();
  }
}