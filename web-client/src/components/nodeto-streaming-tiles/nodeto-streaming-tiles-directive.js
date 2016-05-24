/**
 * @ngdoc directive
 * @name NodetoStreamingTilesModule.directive:nodetoStreamingTiles
 *
 * @description
 * Shows multiple video streaming component.
 *
 * @scope
 * @restrict E
 *
 * @param {Array[Object]} data Streaming configurations.
 * @param {Object} data[item] Streaming configuration (see nodeto-video-streaming config documentation).
 *
 **/
export default class NodetoStreamingTiles {
  constructor() {
    this.templateUrl = 'components/nodeto-streaming-tiles/nodeto-streaming-tiles-tpl.html';
    this.replace = true;
    this.restrict = 'E';
    this.scope = {
      data: '='
    };

    this.controller = NodetoStreamingTilesController;
    this.controllerAs = 'ctrl';
    this.bindToController = true;
  }
}

class NodetoStreamingTilesController {
  constructor() {
    this.rows = this.data && this.data.length && mapToTiles(this.data) || null;

    /**
     * @ngdoc method
     * @name mapToTiles
     * @methodOf NodetoStreamingTilesModule.directive:nodetoStreamingTiles
     *
     * @description
     * Creates a grid system with video streaming elements.
     *
     * @returns {Array[Object]} Array with columns and rows
     */
    function mapToTiles (streamingConfigs) {
      // TODO - calculate maxColumns based on streamingConfigs.length

      var rows = [],
        row,
        column;
      var totalColumns = 12,
        maxColumns = 3,
        defaultValue = totalColumns / maxColumns,
        columnsMap = {
          0: defaultValue,
          1: 12,
          2: 6
        };

      streamingConfigs.forEach(function (streamingConfig, index) {
        if (index % maxColumns === 0) {
          row = {
            columns: []
          };
          rows.push(row);
        }

        if (streamingConfigs.length - (streamingConfigs.length % maxColumns) <= index) {
          column = {
            value: columnsMap[streamingConfigs.length % maxColumns],
            config: streamingConfig
          };
        } else {
          column = {
            value: defaultValue,
            config: streamingConfig
          };
        }

        row.columns.push(column);
      });

      return rows;
    }
  }
}