'use strict';

describe('NodetoSchedulesController Specs', function () {

  var NodetoSchedulesController,
    NodetoScheduleService,
    NodetoMessageService,
    $scope,
    schedulesMockData,
    schedule;

  beforeEach(module('NodetoSchedulesModule'));
  beforeEach(module('NodetoMocks'));
  beforeEach(inject(function (_$controller_, _$rootScope_, _$q_,
                              _SchedulesMockData_,
                              _NodetoScheduleServiceMock_, _NodetoMessageServiceMock_) {

    $scope = _$rootScope_.$new();

    // DATA
    schedulesMockData = _SchedulesMockData_;
    schedule = schedulesMockData[0];

    // Services Mocks
    NodetoScheduleService = _NodetoScheduleServiceMock_;
    NodetoMessageService = _NodetoMessageServiceMock_;

    // Spies
    spyOn(NodetoScheduleService, 'getAll').and.callFake(function() {
      var deferred = _$q_.defer();
      deferred.resolve(schedulesMockData);
      return deferred.promise;
    });

    spyOn(NodetoScheduleService, 'update').and.callFake(function() {
      var deferred = _$q_.defer();
      deferred.resolve();
      return deferred.promise;
    });

    spyOn(NodetoScheduleService, 'remove').and.callFake(function() {
      var deferred = _$q_.defer();
      deferred.resolve();
      return deferred.promise;
    });

    spyOn(NodetoMessageService, 'add').and.callFake(function() {
      var deferred = _$q_.defer();
      deferred.resolve(schedulesMockData);
      return deferred.promise;
    });


    // The controller
    NodetoSchedulesController = _$controller_('NodetoSchedulesController', {
      $scope: $scope,
      NodetoScheduleService: NodetoScheduleService,
      NodetoMessageService: NodetoMessageService
    });

  }));

  it('should have injected the controller', function () {
    expect(NodetoSchedulesController).toBeDefined();
  });

  it('should load all the schedules', function () {
    $scope.$digest();
    expect(NodetoScheduleService.getAll).toHaveBeenCalled();
    expect(NodetoSchedulesController.schedules).toBeDefined();
    expect(NodetoSchedulesController.schedules).toEqual(schedulesMockData);
  });

  describe('updateSchedule $scope method', function () {

    beforeEach(function () {
      schedule = schedulesMockData[0];
      NodetoSchedulesController.updateSchedule(schedule);
    });

    it('should update the schedule', function () {
      expect(NodetoScheduleService.update).toHaveBeenCalledWith(schedule);
    });

    it('should show a success message', function () {
      $scope.$digest();
      expect(NodetoMessageService.add).toHaveBeenCalledWith('Schedule updated');
    });

  });

  describe('removeSchedule $scope method', function () {

    beforeEach(function () {
      NodetoSchedulesController.removeSchedule(schedule.key);
    });

    it('should update the schedule', function () {
      expect(NodetoScheduleService.remove).toHaveBeenCalledWith(schedule.key);
    });

    it('should show a success message', function () {
      $scope.$digest();
      expect(NodetoMessageService.add).toHaveBeenCalledWith('Schedule removed');
    });

  });

});