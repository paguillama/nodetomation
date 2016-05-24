'use strict';

angular.module('NodetoMocks')
  .factory('NodetoAuthenticationServiceMock', function () {
    return {
      getUserData: function () {}
    };
  });