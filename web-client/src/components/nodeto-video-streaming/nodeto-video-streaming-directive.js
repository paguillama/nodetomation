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
 * @param {string} config.streamingId Identifies the streaming to show.
 * @param {boolean} config.expand If true the directive will size the streaming original size.
 *
 **/
export default class NodetoVideoStreaming {
  constructor() {
    this.templateUrl = 'components/nodeto-video-streaming/nodeto-video-streaming-tpl.html';
    this.scope = {
      config: '='
    };

    this.controller = NodetoVideoStreamingController;
  }

  link($scope, element) {

    let canvasContext = element[0]
      .getElementsByClassName('nodeto-video-streaming__canvas')[0]
      .getContext('2d');

    /**
     * @ngdoc property
     * @name img
     * @propertyOf NodetoVideoStreamingModule.directive:nodetoVideoStreaming
     *
     * @description
     * Stores the image element to draw in the canvas element.
     */
    let img = new Image();
    img.onload = function () {

      $scope.width = img.width;
      $scope.height = img.height;

      // Default expand = true
      if ($scope.config.expand === false) {
        $scope.maxWidth = img.width;
        $scope.maxHeight = img.height;
      }

      img.onload = () => canvasContext.drawImage(img, 0, 0);
      img.onload();
    };

    let streamingId = $scope.config.streamingId && ('-' + $scope.config.streamingId) || '';
    $scope.NodetoLiveCommunicationService
      .subscribeScope('nodeto-streaming' + streamingId, $scope, data => img.src = 'data:image/jpeg;base64,' + data);
  }
}

class NodetoVideoStreamingController {
  constructor($scope, NodetoLiveCommunicationService) {
    $scope.NodetoLiveCommunicationService = NodetoLiveCommunicationService;
  }
}