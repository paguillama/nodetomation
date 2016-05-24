export default class NodetoStreamingController {
  constructor (NodetoStreamingService) {
    this.tiles = {
      data: null
    };

    NodetoStreamingService.getAll()
      .then(streaming => this.tiles.data = streaming.map(configMapper))
      .catch(() => this.tiles.data = null);
  }
}

function configMapper (streamingItem) {
  return {
    streamingId: streamingItem.key
    // expand: false
  };
}