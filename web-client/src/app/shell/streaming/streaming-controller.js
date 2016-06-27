export default class NodetoStreamingController {
  constructor (NodetoStreamingService) {
    this.tiles = {
      data: null
    };

    NodetoStreamingService.getAll()
      .then(streaming => {
        this.tiles.data = streaming.map(streamingItem => {
          return {
            videoUrl: NodetoStreamingService.getVideoUrl(streamingItem.key)
          };
        });
      })
      .catch(() => this.tiles.data = null);
  }
}