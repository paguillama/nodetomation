/**
 * @ngdoc service
 * @name NodetoComponentsModule.NodetoComponentsService
 *
 * @description
 * Manages components
 *
 * @requires $http
 * @requires $q
 **/
export default class NodetoComponentsService {

  constructor($http, $q, API_ROOT) {
    this.$http = $http;
    this.$q = $q;
    this.apiUrl = API_ROOT + 'components/';
  }

  /**
   * @ngdoc method
   * @name getAll
   * @methodOf NodetoComponentsModule.NodetoComponentsService
   *
   * @description
   * Get all the components.
   *
   * @returns {Promise} Promise with all the component items
   */
  getAll () {
    return this.$http.get(this.apiUrl)
      .then(res => res.data);
  }

  /**
   * @ngdoc method
   * @name getStatus
   * @methodOf NodetoComponentsModule.NodetoComponentsService
   *
   * @description
   * Get a component status.
   *
   * @param {string} key Component key to get the status.
   *
   * @returns {Promise} Promise with all the component items
   */
  getStatus (key) {
    if (!key) {
      return this.$q.reject('Required component key');
    }
    return this.$http.get(this.apiUrl + key)
      .then(res => res.data.status);
  }

  /**
   * @ngdoc method
   * @name action
   * @methodOf NodetoComponentsModule.NodetoComponentsService
   *
   * @description
   * Executes a component action.
   *
   * @param {string} componentKey Component key to execute the action.
   * @param {string} actionKey Action key to be executed.
   * @param {Object} config Action configuration.
   *
   * @returns {Promise} Promise with the action result
   */
  action (componentKey, actionKey, config) {
    if (!componentKey) {
      return this.$q.reject('Required component key');
    }
    if (!actionKey) {
      return this.$q.reject('Required action key');
    }
    return this.$http.post(this.apiUrl + componentKey + '/actions/' + actionKey, config);
  }
}