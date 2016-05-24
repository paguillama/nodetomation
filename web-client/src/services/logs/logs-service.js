/**
 * @ngdoc service
 * @name NodetoLogsModule.NodetoLogsService
 *
 * @description
 * Manages log files
 *
 * @requires $http
 * @requires $q
 **/
export default class NodetoLogsService {

  constructor($http, $q, API_ROOT) {
    this.$http = $http;
    this.$q = $q;
    this.apiUrl = API_ROOT + 'logs/';
  }

  /**
   * @ngdoc method
   * @name getAll
   * @methodOf NodetoLogsModule.NodetoLogsService
   *
   * @description
   * Get the logs list.
   *
   * @returns {Promise} Promise with all the log items
   */
  getAll () {
    return this.$http.get(this.apiUrl)
      .then(res => res.data);
  }

  /**
   * @ngdoc method
   * @name get
   * @methodOf NodetoLogsModule.NodetoLogsService
   *
   * @description
   * Get a log item.
   *
   * @param {string} key Log key.
   *
   * @returns {Promise} Promise with the log data
   */
  get (key) {
    if (!key) {
      return this.$q.reject('Required key');
    }
    return this.$http.get(this.apiUrl + '/' + key)
      .then(res => res.data);
  }
}