'use strict';

angular.module('NodetoMocks')
  .factory('NodetoComponentsServiceMock', function () {
    return {
      getAll: function () {},
      getStatus: function () {},
      action: function () {}
    };
  });