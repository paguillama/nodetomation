/**
 * @ngdoc directive
 * @name NodetoVideoStreamingModule.directive:nodetoVideoStreaming
 *
 * @description
 * Shows a video streaming to the user.
 *
 * @scope
 * @restrict E
 * @param {Object} config Configuration object.
 * @param {string} config.videoUrl Determines the video url to consume.
 *
 **/
export default class NodetoVideoStreaming {
  constructor() {
    this.templateUrl = 'components/nodeto-video-streaming/nodeto-video-streaming-tpl.html';
    this.replace = true;
    this.restrict = 'E';
    this.scope = {
      config: '='
    };
    this.controller = NodetoVideoStreamingController;
    this.controllerAs = 'ctrl';
    this.bindToController = true;
  }
}

class NodetoVideoStreamingController {}