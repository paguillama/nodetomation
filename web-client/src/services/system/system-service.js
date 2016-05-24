import NodetoSystemShutdownController from './system-shutdown-controller';

const WAIT_SHUTTING_DOWN_SECONDS = 40;

/**
 * @ngdoc service
 * @name NodetoSystemModule.NodetoSystemService
 *
 * @description
 * Manages the system status
 *
 * @requires $http
 * @requires $q
 * @requires $timeout
 * @requires $modal
 * @requires API_ROOT
 * @requires NodetoMessageService
 **/
export default class NodetoSystemService {

  constructor($http, $q, $timeout, $modal,
              API_ROOT, NodetoMessageService) {
    this.$http = $http;
    this.$q = $q;
    this.$timeout = $timeout;
    this.$modal = $modal;
    this.apiUrl = API_ROOT + 'system/';
    this.NodetoMessageService = NodetoMessageService;
  }

  /**
   * @ngdoc method
   * @name shutdown
   * @methodOf NodetoSystemModule.NodetoSystemService
   *
   * @description
   * Sends a shutdown request to the api
   * If success it shows a modal blocking message
   * If fails it shows an instant message
   *
   * @returns {Promise} Promise that indicates if the system will shutdown
   */
  shutdown () {

    return new Promise((resolve, reject) => {
      let shuttingDownModal;

      function checkStatusUntilShutdown () {
        this.$http.get(this.apiUrl + 'status').then(() => {
          this.$timeout(this.checkStatusUntilShutdown, 2000);
        }, () => {
          this.$timeout(function () {
            shuttingDownModal.close();
            this.$modal.open({
              templateUrl: 'services/system/system-shutdown-succeed-tpl.html',
              backdrop: 'static'
            });
          }, WAIT_SHUTTING_DOWN_SECONDS * 1000);
        });
      }

      let shutdownModal = this.$modal.open({
        templateUrl: 'services/system/system-shutdown-tpl.html',
        controller: NodetoSystemShutdownController,
        controllerAs: 'ctrl'
      });

      shutdownModal.result.then(() => {
        shuttingDownModal = this.$modal.open({
          templateUrl: 'services/system/system-shutdown-shutting-down-tpl.html',
          backdrop: 'static'
        });
        this.$http.post(this.apiUrl + 'shutdown', null)
          .then(() => {
            checkStatusUntilShutdown();
            resolve();
          }).catch(() => {
            shuttingDownModal.close();

            this.NodetoMessageService.add('Ups! There was an error shutting down the system', {
              type: 'danger'
            });

            reject();
          });
      }, reject);
    });

  }

  /**
   * @ngdoc method
   * @name getStatus
   * @methodOf NodetoSystemModule.NodetoSystemService
   *
   * @description
   * Returns the system status
   */
  getStatus() {
    return this.$http.get(this.apiUrl + 'status', null)
      .then(requestData => requestData.data);
  }

}