import '../../services/live-communication';

import NodetoVideoStreaming from './nodeto-video-streaming-directive';

export default angular
  .module('NodetoVideoStreamingModule', ['NodetoLiveCommunicationModule'])
  .directive('nodetoVideoStreaming', () => new NodetoVideoStreaming());