/**
 * @ngdoc service
 * @name NodetoStorageModule.NodetoStorageService
 *
 * @description
 * localStorage wrapper
 *
 * @requires $window
 **/
export default class NodetoStorageService {

  constructor($window) {
    this.store = $window.localStorage;
  }

  get (key) {
    return this.store.getItem(key);
  }

  set (key, value) {
    if (key) {
      if (value) {
        this.store.setItem(key, value);
      } else {
        this.store.removeItem(key);
      }
    }
  }
}