import '../nodeto-video-streaming';

import NodetoStreamingTiles from './nodeto-streaming-tiles-directive';

export default angular
  .module('NodetoStreamingTilesModule', ['NodetoVideoStreamingModule'])
  .directive('nodetoStreamingTiles', () => new NodetoStreamingTiles());