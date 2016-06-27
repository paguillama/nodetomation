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

  constructor($http, API_ROOT, STREAMING_ROOT, NodetoAuthenticationService) {
    this.$http = $http;
    this.apiUrl = `${API_ROOT}streaming/`;
    this.STREAMING_ROOT = STREAMING_ROOT;
    this.NodetoAuthenticationService = NodetoAuthenticationService;
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

  /**
   * @ngdoc method
   * @name getVideoUrl
   * @methodOf NodetoStreamingServiceModule.NodetoStreamingService
   *
   * @description
   * Given a streaming key returns the complete URL
   *
   * @returns {string} Video url with authentication parameters
   */
  getVideoUrl (key) {
    return `${this.STREAMING_ROOT}${key}?token=${this.NodetoAuthenticationService.getToken()}`;
  }
}