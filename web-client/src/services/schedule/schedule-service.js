/**
 * @ngdoc service
 * @name NodetoScheduleModule.NodetoScheduleService
 *
 * @description
 * Manages schedules
 *
 * @requires $http
 * @requires API_ROOT
 **/
export default class NodetoScheduleService {

  constructor($http, API_ROOT) {
    this.$http = $http;
    this.apiUrl = API_ROOT + 'schedules/';
  }

  /**
   * @ngdoc method
   * @name getAll
   * @methodOf NodetoScheduleModule.NodetoScheduleService
   *
   * @description
   * Get all the schedule items
   *
   * @returns {Promise} Promise with all the schedule items
   */
  getAll () {
    return this.$http.get(this.apiUrl)
      .then(res => res.data);
  }

  /**
   * @ngdoc method
   * @name update
   * @methodOf NodetoScheduleModule.NodetoScheduleService
   *
   * @description
   * Updates a schedule
   *
   * @param {Object} schedule Schedule to update.
   *
   * @returns {Promise} Promise with the result of the update
   */
  update (schedule) {
    return this.$http.put(this.apiUrl + schedule.key, schedule)
      .then(res => res.data);
  }

  /**
   * @ngdoc method
   * @name remove
   * @methodOf NodetoScheduleModule.NodetoScheduleService
   *
   * @description
   * Removes a schedule
   *
   * @param {string} key Schedule key to remove.
   *
   * @returns {Promise} Promise with the result of the deletion
   */
  remove (key) {
    return this.$http.delete(this.apiUrl + key)
      .then(res => res.data);
  }
}