'use strict';

angular.module('NodetoMocks')
  .factory('SchedulesMockData', function () {
    return [{
      name: 'Light schedule',
      key: 'light-schedule',
      tasks: [ {
        key: 'light-schedule-turn-on',
        cronTime: '0 6 * * *',
        actionKey: 'turn-on-light'
      },
      {
        key: 'light-schedule-turn-off',
        cronTime: '0 18 * * *',
        actionKey: 'turn-off-light'
      }]
    }, {
      name: 'Irrigation',
      key: 'irrigation',
      tasks:[{
        key: 'irrigation-turn-on',
        cronTime: '30 8 * * *',
        actionKey: 'irrigate'
      }]
    }];
  });