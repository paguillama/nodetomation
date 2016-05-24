/**
 * @ngdoc service
 * @name NodetoStreamingServiceModule.NodetoStreamingService
 *
 * @description
 * Manages video streaming
 *
 * @requires $http
 * @requires API_ROOT
 **/
export default class NodetoStreamingService {

  constructor($http, API_ROOT) {
    this.$http = $http;
    this.apiUrl = API_ROOT + 'streaming/';
  }

  /**
   * @ngdoc method
   * @name getAll
   * @methodOf NodetoStreamingServiceModule.NodetoStreamingService
   *
   * @description
   * Get all the streaming items
   *
   * @returns {Promise} Promise with all the streaming items
   */
  getAll () {
    return this.$http.get(this.apiUrl).then(res => res.data);
  }

}