'use strict';

angular.module('NodetoMocks')
  .factory('ComponentsMockData', function () {

    return [{
      name: 'Light',
      key: 'central-light',
      typeKey: 'light',
      state: {
        value: false
      },
      coordinates: {
        x: 50,
        y: 50
      },
      defaultAction: 'turn-on',
      actions: [ 'turn-on' ]
    },
    {
      name: 'Fan',
      key: 'central-fan',
      typeKey: 'fan',
      state: {
        value: false
      },
      coordinates: {
        x: 0,
        y: 90
      },
      defaultAction: 'turn-on',
      actions: [ 'turn-on' ]
    },
    {
      name: 'Irrigator',
      key: 'central-irrigator',
      typeKey: 'irrigator',
      state: {
        value: false
      },
      coordinates: {
        x: 100,
        y: 90
      },
      defaultAction: 'turn-on',
      actions: [ 'turn-on' ]
    },
    {
      name: 'Thermometer',
      key: 'central-thermometer',
      typeKey: 'thermometer',
      state: {
        value:null
      },
      coordinates: {
        x: 0,
        y: 10
      },
      actions: []
    },
    {
      name: 'central camera',
      key: 'central-camera',
      typeKey: 'camera',
      state: {
        value: false
      },
      coordinates: {
        x: 50,
        y: 0
      },
      defaultAction: 'start-streaming',
      actions: [ 'start-streaming' ]
    }];
  });
